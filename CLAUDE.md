# CLAUDE.md

Guía para Claude Code en este repositorio.

## Qué es cobranza-sena

cobranza sena

**Repo:** `flujopay/cobranza-sena`
**Stack:** Next.js / React
**Puerto local:** N/A

## Stack y dependencias

Ver `package.json` / `pyproject.toml` / equivalente para la lista completa.

**Para levantar localmente:**
```bash
# Instalar dependencias
npm install   # o: pip install -r requirements.txt / poetry install

# Levantar servidor de desarrollo
npm run dev   # o el comando equivalente del stack
```

## Convenciones

### Commits

Formato conventional commits:

```
feat(scope): descripción #N
fix(scope): descripción #N
hotfix(scope): descripción #N
refactor(scope): descripción #N
docs(scope): descripción #N
chore(scope): descripción #N
```

Types válidos: `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `build`, `style`, `revert`. Header máximo 100 chars.

### Branching

Modelo **3 branches protegidas**:

| Branch | Rol |
|---|---|
| `main` | Producción. Solo recibe merges desde `staging` y hotfixes. |
| `staging` | Pre-producción / QA. Recibe merges desde `dev`. |
| `dev` | Integración. Default para features y fixes. |
| `feat/*`, `fix/*`, `hotfix/*` | Ramas de trabajo efímeras. |

**Flujo estándar:**
1. Crea branch desde `dev`: `git checkout -b feat/issue-{N}-descripcion`
2. Commits conventional referenciando issue: `feat(scope): descripción #N`
3. Abre PR contra `dev`. Body incluye `Closes #N`.
4. Squash merge → `dev`.

### Tests

- Cada feature requiere: happy path + validation errors + auth errors.
- No escribir tests vacíos sin asserts.
- Correr el test con el código roto para confirmar que falla primero.

## Context policy

Todo contexto de proyecto vive en GitHub.

| Contexto | Dónde |
|---|---|
| Estado de una feature | Issue de GitHub (comments) |
| Plan de un work-item | Body del issue padre + sub-issues (tasks) |
| Progreso de sesión | Comment en el issue activo |
| Convenciones | Este `CLAUDE.md` + `.claude/rules/` |
| Preferencias personales | `CLAUDE.local.md` (no commitear) |

## Flujo estándar de trabajo

```
Desarrollo:
  /init → /plan → /apply → /test → /build → /review

Deploy:
  /secure → /deploy

Soporte:
  /debug    — cuando /apply o /test fallan
  /audit    — revisión OWASP profunda antes de mergear cambios sensibles
  /pentest  — barrida completa de seguridad sobre todo el proyecto (periódico)
  /sync     — cuando hay drift entre código y GitHub
  /rollback — cuando un deploy rompe producción
  /design   — cuando hay trabajo de UI/UX
  /triage   — limpieza periódica de issues
```

**Reglas operativas para Claude:**

1. Al arrancar sesión: `/init`
2. Al cerrar sesión: `/build`
3. Antes de cada deploy: `/secure` es obligatorio.
4. Si el plan en GitHub no refleja el código: correr `/sync`.
5. Aprendizajes que deben persistir: commitear al `CLAUDE.md`.
