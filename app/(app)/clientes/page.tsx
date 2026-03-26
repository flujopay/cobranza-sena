"use client";

import { useState, useCallback } from "react";
import { useClients } from "@/lib/hooks/useClients";
import { Table, type Column } from "@/components/ui/Table";
import type { Client } from "@/lib/api/types/clients";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCLP(value: string | null): string {
  if (!value) return "$0";
  const n = parseFloat(value);
  return isNaN(n) ? "—" : `$${n.toLocaleString("es-CL")}`;
}

function DebtBadge({ value }: { value: string | null }) {
  const n = parseFloat(value ?? "0");
  if (isNaN(n) || n === 0) return <span className="text-gray-400 text-xs">$0</span>;
  return <span className="font-semibold text-red-600">{formatCLP(value)}</span>;
}

function PaidBadge({ value }: { value: string | null }) {
  const n = parseFloat(value ?? "0");
  if (isNaN(n) || n === 0) return <span className="text-gray-400 text-xs">$0</span>;
  return <span className="font-medium text-green-700">{formatCLP(value)}</span>;
}

function ExpiredBadge({ value }: { value: string | null }) {
  const n = parseFloat(value ?? "0");
  if (isNaN(n) || n === 0) return <span className="text-gray-400 text-xs">—</span>;
  return <span className="font-medium text-orange-600">{formatCLP(value)}</span>;
}

function CountPill({ total, paid, expired }: { total: number | null; paid: number | null; expired: number | null }) {
  if (!total) return <span className="text-gray-400 text-xs">0</span>;
  return (
    <div className="flex items-center gap-1 justify-center">
      <span className="font-medium text-gray-700">{total}</span>
      {(expired ?? 0) > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">
          {expired} venc.
        </span>
      )}
      {(paid ?? 0) > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
          {paid} pag.
        </span>
      )}
    </div>
  );
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columns: Column<Client>[] = [
  {
    key: "ruc",
    header: "RUT",
    render: r => <span className="font-mono text-xs text-gray-600">{r.ruc}</span>,
  },
  {
    key: "company_name",
    header: "Razón Social",
    render: r => (
      <div className="flex flex-col gap-0.5 max-w-[220px]">
        <span className="font-medium text-gray-900 truncate" title={r.company_name ?? ""}>
          {r.company_name || "—"}
        </span>
        {r.comercial_name && r.comercial_name !== r.company_name && (
          <span className="text-[11px] text-gray-400 truncate">{r.comercial_name}</span>
        )}
      </div>
    ),
    sortValue: r => r.company_name ?? "",
  },
  {
    key: "comercial_email",
    header: "Email",
    render: r => r.comercial_email
      ? <a href={`mailto:${r.comercial_email}`} className="text-blue-600 hover:underline text-xs">{r.comercial_email}</a>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "comercial_phone",
    header: "Teléfono",
    render: r => r.comercial_phone
      ? <span className="text-xs">{r.comercial_phone}</span>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "ammount_total",
    header: "Total Facturado",
    align: "right",
    render: r => <span className="text-xs text-gray-600">{formatCLP(r.ammount_total)}</span>,
    sortValue: r => parseFloat(r.ammount_total ?? "0"),
  },
  {
    key: "ammount_debt",
    header: "Deuda",
    align: "right",
    render: r => <DebtBadge value={r.ammount_debt} />,
    sortValue: r => parseFloat(r.ammount_debt ?? "0"),
  },
  {
    key: "ammount_paid",
    header: "Pagado",
    align: "right",
    render: r => <PaidBadge value={r.ammount_paid} />,
    sortValue: r => parseFloat(r.ammount_paid ?? "0"),
  },
  {
    key: "ammount_expired",
    header: "Vencido",
    align: "right",
    render: r => <ExpiredBadge value={r.ammount_expired} />,
    sortValue: r => parseFloat(r.ammount_expired ?? "0"),
  },
  {
    key: "ammount_current",
    header: "Vigente",
    align: "right",
    render: r => <span className="text-xs text-gray-600">{formatCLP(r.ammount_current)}</span>,
    sortValue: r => parseFloat(r.ammount_current ?? "0"),
  },
  {
    key: "count_total",
    header: "Facturas",
    align: "center",
    render: r => <CountPill total={r.count_total} paid={r.count_paid} expired={r.count_expired} />,
    sortValue: r => r.count_total ?? 0,
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ClientesPage() {
  const [page,   setPage]   = useState(1);
  const [limit,  setLimit]  = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isError } = useClients({ page, limit, search: search || undefined });

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
          Inicio / <span className="text-gray-700 font-medium">Clientes</span>
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <p className="mt-1 text-sm text-gray-500">
          {count > 0 ? `${count.toLocaleString("es-CL")} clientes registrados.` : "Listado de clientes con deuda activa."}
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          No se pudieron cargar los clientes. Intenta recargar la página.
        </div>
      ) : (
        <Table
          columns={columns}
          data={results}
          keyField="id"
          emptyMessage="No hay clientes registrados."
          searchPlaceholder="Buscar por RUT, razón social…"
          isLoading={isLoading}
          isFetching={isFetching}
          serverPagination={{
            page,
            totalPages,
            from,
            to,
            count,
            limit,
            onPageChange: setPage,
            onLimitChange: (n) => { setLimit(n); setPage(1); },
          }}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
}
