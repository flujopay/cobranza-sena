"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactNode } from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sortValue?: (row: T) => string | number; // valor para ordenar si usa render
};

type SortDir = "asc" | "desc";

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  pageSize?: number;
  searchPlaceholder?: string;
}

const PAGE_OPTIONS = [10, 25, 50, 100];

/* ── Dropdown de filas por página ── */
function PerPageDropdown({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 8,
          border: "1px solid #e5e7eb", background: "#fff",
          fontSize: 12, color: "#374151", cursor: "pointer",
          fontWeight: 500, whiteSpace: "nowrap",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#3771D1")}
        onMouseLeave={e => !open && (e.currentTarget.style.borderColor = "#e5e7eb")}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        {value} por página
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50,
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", overflow: "hidden", minWidth: 140,
        }}>
          <div style={{ padding: "4px" }}>
            {PAGE_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => { onChange(n); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: value === n ? 600 : 400,
                  background: value === n ? "#eef3fc" : "transparent",
                  color: value === n ? "#3771D1" : "#374151",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (value !== n) (e.currentTarget.style.background = "#f9fafb"); }}
                onMouseLeave={e => { if (value !== n) (e.currentTarget.style.background = "transparent"); }}
              >
                <span>{n} filas</span>
                {value === n && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3771D1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Ícono de ordenamiento ── */
function SortIcon({ dir }: { dir: SortDir | null }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 1, marginLeft: 4, opacity: dir ? 1 : 0.3 }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"
        style={{ opacity: dir === "asc" ? 1 : 0.35 }}>
        <path d="M4 1L7 6H1L4 1Z" />
      </svg>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"
        style={{ opacity: dir === "desc" ? 1 : 0.35 }}>
        <path d="M4 7L1 2H7L4 7Z" />
      </svg>
    </span>
  );
}

/* ── Paginación ── */
function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

/* ── Tabla principal ── */
export function Table<T>({
  columns,
  data,
  keyField,
  emptyMessage = "Sin resultados.",
  pageSize = 10,
  searchPlaceholder = "Buscar…",
}: TableProps<T>) {
  const [query,   setQuery]   = useState("");
  const [page,    setPage]    = useState(1);
  const [perPage, setPerPage] = useState(pageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  // 1. Filtrado
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return data;
    return data.filter(row =>
      columns.some(col => {
        if (col.render && !col.sortValue) return false;
        const val = col.sortValue
          ? String(col.sortValue(row)).toLowerCase()
          : String((row as any)[col.key] ?? "").toLowerCase();
        return val.includes(q);
      })
    );
  }, [data, query, columns]);

  // 2. Ordenamiento
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find(c => String(c.key) === sortKey);
    return [...filtered].sort((a, b) => {
      const va = col?.sortValue ? col.sortValue(a) : (a as any)[sortKey] ?? "";
      const vb = col?.sortValue ? col.sortValue(b) : (b as any)[sortKey] ?? "";
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else {
        cmp = String(va).localeCompare(String(vb), "es", { numeric: true, sensitivity: "base" });
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  // 3. Paginación
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paged      = sorted.slice((safePage - 1) * perPage, safePage * perPage);

  const from = sorted.length === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to   = Math.min(safePage * perPage, sorted.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
        {/* Búsqueda */}
        <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            style={{
              width: "100%", paddingLeft: 32, paddingRight: query ? 28 : 12, paddingTop: 7, paddingBottom: 7,
              fontSize: 13, borderRadius: 8, border: "1px solid #e5e7eb",
              background: "#f9fafb", outline: "none", color: "#374151",
              transition: "border-color 0.15s", boxSizing: "border-box",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#3771D1")}
            onBlur={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
          {query && (
            <button onClick={() => setQuery("")}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {sorted.length === 0 ? "0 resultados" : `${from}–${to} de ${sorted.length}`}
          </span>
          <PerPageDropdown value={perPage} onChange={n => { setPerPage(n); setPage(1); }} />
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fb" }}>
              {columns.map(col => {
                const key    = String(col.key);
                const isSorted = sortKey === key;
                const canSort  = col.sortable !== false; // sortable por defecto
                return (
                  <th
                    key={key}
                    onClick={() => canSort && handleSort(key)}
                    style={{
                      padding: "10px 16px",
                      textAlign: col.align === "right" ? "right" : col.align === "center" ? "center" : "left",
                      fontSize: 11, fontWeight: 600, color: isSorted ? "#3771D1" : "#9ca3af",
                      textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
                      borderBottom: "1px solid #f0f0f0",
                      cursor: canSort ? "pointer" : "default",
                      userSelect: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => { if (canSort && !isSorted) (e.currentTarget.style.color = "#6b7280"); }}
                    onMouseLeave={e => { if (!isSorted) (e.currentTarget.style.color = "#9ca3af"); }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      {col.header}
                      {canSort && <SortIcon dir={isSorted ? sortDir : null} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: "56px 16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#d1d5db" }}>
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    {query ? `Sin resultados para "${query}"` : emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={String(row[keyField])}
                  style={{ borderBottom: i < paged.length - 1 ? "1px solid #f3f4f6" : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {columns.map((col, ci) => (
                    <td
                      key={String(col.key)}
                      style={{
                        padding: "12px 16px", whiteSpace: "nowrap",
                        textAlign: col.align === "right" ? "right" : col.align === "center" ? "center" : "left",
                        color: ci === 0 ? "#111827" : "#374151",
                        fontWeight: ci === 0 ? 500 : 400,
                      }}
                    >
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500,
              cursor: safePage === 1 ? "not-allowed" : "pointer",
              opacity: safePage === 1 ? 0.4 : 1, transition: "border-color 0.15s",
            }}
            onMouseEnter={e => { if (safePage !== 1) (e.currentTarget.style.borderColor = "#3771D1"); }}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Anterior
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {pageRange(safePage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} style={{ padding: "0 4px", color: "#9ca3af", fontSize: 12 }}>…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 8, border: "none", fontSize: 12, fontWeight: safePage === p ? 600 : 400,
                    background: safePage === p ? "#3771D1" : "transparent",
                    color: safePage === p ? "#fff" : "#6b7280",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (safePage !== p) (e.currentTarget.style.background = "#f3f4f6"); }}
                  onMouseLeave={e => { if (safePage !== p) (e.currentTarget.style.background = "transparent"); }}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500,
              cursor: safePage === totalPages ? "not-allowed" : "pointer",
              opacity: safePage === totalPages ? 0.4 : 1, transition: "border-color 0.15s",
            }}
            onMouseEnter={e => { if (safePage !== totalPages) (e.currentTarget.style.borderColor = "#3771D1"); }}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
          >
            Siguiente
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
