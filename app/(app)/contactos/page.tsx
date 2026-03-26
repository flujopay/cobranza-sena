"use client";

import { useState, useCallback } from "react";
import { useContacts } from "@/lib/hooks/useContacts";
import { Table, type Column } from "@/components/ui/Table";
import type { Contact } from "@/lib/api/types/contacts";

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columns: Column<Contact>[] = [
  {
    key: "name",
    header: "Nombre",
    render: r => {
      const full = [r.name, r.lastname].filter(Boolean).join(" ");
      return full
        ? <span className="font-medium text-gray-900">{full}</span>
        : <span className="text-gray-300 text-xs">—</span>;
    },
    sortValue: r => [r.name, r.lastname].filter(Boolean).join(" "),
  },
  {
    key: "email",
    header: "Email",
    render: r => r.email
      ? <a href={`mailto:${r.email}`} className="text-blue-600 hover:underline text-xs">{r.email}</a>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "phone",
    header: "Teléfono",
    render: r => r.phone
      ? <span className="text-xs">{r.phone}</span>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "ruc",
    header: "RUT",
    render: r => r.ruc
      ? <span className="font-mono text-xs text-gray-600">{r.ruc}</span>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "position",
    header: "Cargo",
    render: r => r.position
      ? <span className="text-xs text-gray-700">{r.position}</span>
      : <span className="text-gray-300 text-xs">—</span>,
    sortValue: r => r.position ?? "",
  },
  {
    key: "area",
    header: "Área",
    render: r => r.area
      ? <span className="text-xs text-gray-600">{r.area}</span>
      : <span className="text-gray-300 text-xs">—</span>,
    sortValue: r => r.area ?? "",
  },
  {
    key: "client_name",
    header: "Cliente",
    render: r => (
      <div className="flex flex-col gap-0.5 max-w-[200px]">
        <span className="text-sm text-gray-800 truncate" title={r.client_name ?? ""}>{r.client_name || "—"}</span>
        {r.client_ruc && (
          <span className="font-mono text-[11px] text-gray-400">{r.client_ruc}</span>
        )}
      </div>
    ),
    sortValue: r => r.client_name ?? "",
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ContactosPage() {
  const [page,   setPage]   = useState(1);
  const [limit,  setLimit]  = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isError } = useContacts({ page, limit, search: search || undefined });

  const results    = data?.results     ?? [];
  const totalPages = data?.total_pages ?? 1;
  const count      = data?.count       ?? 0;
  const from       = count === 0 ? 0 : (page - 1) * limit + 1;
  const to         = Math.min(page * limit, count);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">
          Inicio / <span className="text-gray-700 font-medium">Contactos</span>
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Contactos</h1>
        <p className="mt-1 text-sm text-gray-500">
          {count > 0 ? `${count.toLocaleString("es-CL")} contactos registrados.` : "Personas de contacto por cliente para gestionar la cobranza."}
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          No se pudieron cargar los contactos. Intenta recargar la página.
        </div>
      ) : (
        <Table
          columns={columns}
          data={results}
          keyField="id"
          emptyMessage="No hay contactos registrados."
          searchPlaceholder="Buscar por nombre, email, RUT…"
          isLoading={isLoading}
          isFetching={isFetching}
          serverPagination={{
            page, totalPages, from, to, count, limit,
            onPageChange: setPage,
            onLimitChange: (n) => { setLimit(n); setPage(1); },
          }}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
}
