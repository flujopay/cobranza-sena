#!/usr/bin/env bash
# no-edit-without-plan.sh
#
# Claude Code PreToolUse hook que enforce el guardrail "no editar sin plan"
# documentado en CLAUDE.md. Bloquea edits a código de producción cuando la rama
# actual es una branch protegida (dev / main / staging) o una branch sin
# prefijo conocido de work-item.
#
# Lee JSON del PreToolUse por stdin:
#   { "tool_name": "...", "tool_input": { ... }, ... }
#
# Salida:
#   exit 0 → permite la tool call
#   exit 2 → bloquea, el mensaje en stderr llega al modelo como error
#
# Variables de entorno:
#   CLAUDE_ALLOW_DIRECT_EDIT=1  → bypass de emergencia (queda log en stderr)
#   CLAUDE_PROTECTED_BRANCHES   → override (default: "dev main staging")
#   CLAUDE_WORKITEM_PREFIXES    → override (default: "feature fix refactor chore hotfix")

set -euo pipefail

PROTECTED="${CLAUDE_PROTECTED_BRANCHES:-dev main staging}"
PREFIXES="${CLAUDE_WORKITEM_PREFIXES:-feature fix refactor chore hotfix}"

# ── Leer payload del hook ────────────────────────────────────────────────────
payload="$(cat || true)"
if [[ -z "$payload" ]]; then
  exit 0  # sin payload, no hay nada que verificar
fi

# Extracción tolerante a falta de jq: intentamos jq, si no usamos sed.
extract() {
  local key="$1"
  if command -v jq >/dev/null 2>&1; then
    jq -r "$key // empty" <<<"$payload" 2>/dev/null || true
  else
    # Fallback sin jq — funciona para keys simples top-level.
    # No soporta paths anidados, así que solo se usa para tool_name.
    python3 -c "import sys,json; d=json.load(sys.stdin); ks='$key'.lstrip('.').split('.'); v=d
for k in ks:
  v = v.get(k) if isinstance(v, dict) else None
  if v is None: break
print(v if v is not None else '')" <<<"$payload" 2>/dev/null || true
  fi
}

tool_name="$(extract '.tool_name')"
[[ -z "$tool_name" ]] && exit 0

# Solo nos importan tools que escriben archivos.
case "$tool_name" in
  Edit|MultiEdit|Write|NotebookEdit) ;;
  Bash) ;;
  *) exit 0 ;;
esac

# ── Resolver rama actual ─────────────────────────────────────────────────────
# Si no estamos en un repo git (ej. workspace recién creado, scripts genéricos),
# no bloqueamos — el guardrail solo aplica donde hay flujo de branches.
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

# ── Detección de orchestrator (no aplica guardrail) ──────────────────────────
# Un orchestrator es un repo coordinador que solo guarda metadata (repos.yaml,
# bootstrap.sh, Makefile, CLAUDE.md). No tiene flujo dev/main/staging — vive en
# main. El work-item flow ocurre en los satélites, no aquí. El guardrail solo
# se aplica en repos satélites.
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"
if [[ -n "$repo_root" ]] && { [[ -f "$repo_root/repos.yaml" ]] || [[ -f "$repo_root/orchestrator.yaml" ]]; }; then
  exit 0
fi

branch="$(git symbolic-ref --short HEAD 2>/dev/null || echo "")"
if [[ -z "$branch" ]]; then
  # detached HEAD — bloqueamos por seguridad (probablemente algo inesperado)
  branch="(detached HEAD)"
fi

# ── Bypass de emergencia ─────────────────────────────────────────────────────
if [[ "${CLAUDE_ALLOW_DIRECT_EDIT:-}" == "1" ]]; then
  echo "[no-edit-without-plan] BYPASS active (CLAUDE_ALLOW_DIRECT_EDIT=1) on branch '$branch'" >&2
  exit 0
fi

# ── Determinar paths afectados ───────────────────────────────────────────────
# Para Edit/Write/NotebookEdit: tool_input.file_path
# Para MultiEdit: tool_input.file_path (un solo file)
# Para Bash: tool_input.command — buscamos heuristics de escritura.

paths=()
case "$tool_name" in
  Edit|MultiEdit|Write|NotebookEdit)
    fp="$(extract '.tool_input.file_path')"
    [[ -n "$fp" ]] && paths+=("$fp")
    ;;
  Bash)
    cmd="$(extract '.tool_input.command')"
    [[ -z "$cmd" ]] && exit 0

    # ── Modelo del guardrail para Bash ──────────────────────────────────────
    # El guardrail protege la rama dev/main/staging de modificaciones al
    # working tree. NO restringe operaciones de git/gh/checkout — desde dev
    # debes poder hacer git checkout, git pull, gh issue close, gh pr merge,
    # etc. sin trabas. Solo bloqueamos comandos que claramente modifican
    # archivos del repo en la rama actual.
    #
    # Estrategia:
    # 1. Limpiar el comando de ruido (heredocs, strings, comentarios,
    #    redirecciones a /dev/null) para no matchear substrings.
    # 2. Whitelistar líneas enteras de git/gh/checkout/pull/fetch/merge/log/etc.
    # 3. Solo bloquear si quedan señales claras de escritura al working tree:
    #    redirecciones a archivos del repo (no /dev/null), cp/mv/rm/mkdir/
    #    touch/tee/sed -i sobre paths del repo.

    cmd_check="$cmd"
    # Strip redirects to /dev/null (any fd: >/dev/null, 2>/dev/null, &>/dev/null)
    cmd_check="$(echo "$cmd_check" | sed -E 's|[0-9&]*>>?[[:space:]]*/dev/null||g')"
    # Strip heredoc bodies: from <<[-]?WORD until line == WORD
    cmd_check="$(echo "$cmd_check" | awk '
      BEGIN { in_heredoc=0; tag="" }
      {
        if (in_heredoc) {
          if ($0 == tag || $0 == tag";") { in_heredoc=0; tag=""; next }
          next
        }
        line=$0
        if (match(line, /<<-?[[:space:]]*['\''"]?[A-Za-z_][A-Za-z0-9_]*['\''"]?/)) {
          frag=substr(line, RSTART, RLENGTH)
          gsub(/^<<-?[[:space:]]*['\''"]?/, "", frag)
          gsub(/['\''"]?$/, "", frag)
          tag=frag; in_heredoc=1
        }
        print line
      }')"
    # Strip single-quoted and double-quoted string contents (keep quotes as markers).
    cmd_check="$(echo "$cmd_check" | sed -E "s/'[^']*'/''/g; s/\"[^\"]*\"/\"\"/g")"
    # Strip line comments
    cmd_check="$(echo "$cmd_check" | sed -E 's/[[:space:]]#.*$//')"

    # ── Whitelist: comandos que NUNCA modifican el working tree ────────────
    # git checkout/switch/pull/fetch/merge/log/status/diff/branch/tag/...:
    #   cambian refs y working tree pero los considera el flujo legítimo
    #   (mover de dev a otra rama, sincronizar, cerrar work).
    # gh ...:           opera contra GitHub API, no toca el repo local.
    # ls, cat, head, tail, grep, find, jq, awk: lectura.
    # make, npm, pnpm, yarn, bun, node, python: builds/runs (afectan dist
    #   pero típicamente fuera del scope del guardrail; el dev decide).
    #
    # Si TODA línea no vacía del comando empieza con uno de estos, exit 0.
    is_safe_cmd() {
      local line="$1"
      # Quitar leading whitespace y "env VAR=val ... " y "command "
      line="$(echo "$line" | sed -E 's/^[[:space:]]+//')"
      while [[ "$line" =~ ^(env|command)[[:space:]] || "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*[[:space:]] ]]; do
        line="$(echo "$line" | sed -E 's/^(env|command)[[:space:]]+//; s/^[A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*[[:space:]]+//')"
      done
      case "$line" in
        ""|"#"*) return 0 ;;
        git[[:space:]]*|"git") return 0 ;;
        gh[[:space:]]*|"gh") return 0 ;;
        ls[[:space:]]*|"ls"|cat[[:space:]]*|"cat"|head[[:space:]]*|"head"|tail[[:space:]]*|"tail") return 0 ;;
        grep[[:space:]]*|"grep"|rg[[:space:]]*|"rg"|find[[:space:]]*|"find"|jq[[:space:]]*|"jq") return 0 ;;
        echo[[:space:]]*|"echo"|printf[[:space:]]*|"printf"|true|false) return 0 ;;
        pwd|whoami|date|which[[:space:]]*|type[[:space:]]*) return 0 ;;
        source[[:space:]]*|".[[:space:]]"*) return 0 ;;
        export[[:space:]]*) return 0 ;;
      esac
      return 1
    }

    # Señal dura: redirección a archivo del repo (no /dev/null, ya stripeado),
    # cp/mv/rm/mkdir/touch/tee/sed -i. Si aparece, no aplicamos whitelist —
    # el comando está escribiendo al working tree aunque empiece con echo/cat.
    has_write_signal=false
    if echo "$cmd_check" | grep -qE '(>>?[[:space:]]*[^|&;[:space:]/]|[[:space:]]tee[[:space:]]|(^|[[:space:];|&])(sed|perl)[[:space:]]+-i|python[[:space:]]+-c.*open.*[wa]|(^|[[:space:];|&])(cp|mv|rm|mkdir|touch)[[:space:]]|cat[[:space:]]+>)'; then
      has_write_signal=true
    fi

    if ! $has_write_signal; then
      # Sin señal de escritura — verificamos que cada parte sea un comando
      # safe conocido. Si todo es git/gh/lectura, exit 0.
      all_safe=true
      while IFS= read -r line; do
        while IFS= read -r part; do
          [[ -z "${part// }" ]] && continue
          if ! is_safe_cmd "$part"; then
            all_safe=false
            break 2
          fi
        done < <(echo "$line" | sed -E 's/(\|\||&&|;|\|)/\n/g')
      done <<< "$cmd_check"
      $all_safe && exit 0
      # Hay un comando desconocido sin señal de escritura → permitir
      # (build, tests, scripts custom). El guardrail es para escrituras
      # al working tree, no para todo lo no-whitelisteado.
      exit 0
    fi
    # No intentamos extraer cada path destino — basta saber que el comando
    # escribe en disco. Validamos solo por rama.
    paths+=("<bash-write-command>")
    ;;
esac

# ── Whitelist de paths siempre permitidos ────────────────────────────────────
# Estos archivos son configuración local del flujo, no código de producción.
is_whitelisted_path() {
  local p="$1"
  # Vacío o señal genérica de bash → no path-whitelist
  [[ -z "$p" || "$p" == "<bash-write-command>" ]] && return 1

  # Normalizar a relativo respecto al repo si es absoluto y cae dentro
  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"
  if [[ -n "$repo_root" && "$p" == "$repo_root"/* ]]; then
    p="${p#"$repo_root"/}"
  fi

  case "$p" in
    .claude/*|*/.claude/*) return 0 ;;
    CLAUDE.local.md|*/CLAUDE.local.md) return 0 ;;
    .gitignore|*/.gitignore) return 0 ;;
    /tmp/*|/var/tmp/*) return 0 ;;  # archivos temporales fuera del repo
  esac
  return 1
}

# Si TODOS los paths están whitelisteados, dejamos pasar sin chequear rama.
if [[ "$tool_name" != "Bash" ]]; then
  all_whitelisted=true
  for p in "${paths[@]}"; do
    if ! is_whitelisted_path "$p"; then
      all_whitelisted=false
      break
    fi
  done
  $all_whitelisted && exit 0
fi

# ── Chequeo de rama ──────────────────────────────────────────────────────────
# Branch protegida → bloquear.
for protected in $PROTECTED; do
  if [[ "$branch" == "$protected" ]]; then
    cat >&2 <<EOF
⛔ Edit blocked by no-edit-without-plan guardrail.

Current branch: '$branch' (protected — never edit directly).
Tool: $tool_name${paths[0]:+ → ${paths[0]}}

Required flow:
  1. Confirm a work-item with /plan (creates GitHub issue + sub-issues).
  2. /apply will create a work-item branch (feature/N-slug, fix/N-slug, ...).
  3. Edit on the work-item branch.

Bypass for emergencies: set CLAUDE_ALLOW_DIRECT_EDIT=1 (logged to stderr).
Whitelist: edits under .claude/ and CLAUDE.local.md are always allowed.
EOF
    exit 2
  fi
done

# Branch debe matchear un prefijo de work-item.
branch_ok=false
for prefix in $PREFIXES; do
  if [[ "$branch" == "$prefix"/* ]]; then
    branch_ok=true
    break
  fi
done

if ! $branch_ok; then
  cat >&2 <<EOF
⛔ Edit blocked by no-edit-without-plan guardrail.

Current branch: '$branch' — not a recognized work-item branch.
Tool: $tool_name${paths[0]:+ → ${paths[0]}}

Expected branch prefix (one of): $PREFIXES
Format: <prefix>/<issue-number>-<slug>   (e.g. feature/42-add-pagination)

If you are mid-planning, finish /plan first so a work-item branch is created.
Bypass: CLAUDE_ALLOW_DIRECT_EDIT=1.
EOF
  exit 2
fi

exit 0
