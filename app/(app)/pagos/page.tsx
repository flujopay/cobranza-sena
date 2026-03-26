"use client";

import { useState, useCallback } from "react";
import { usePayments } from "@/lib/hooks/usePayments";
import { Table, type Column } from "@/components/ui/Table";
import type { Payment } from "@/lib/api/types/payments";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCLP(value: string | null): string {
  if (!value) return "$0";
  const n = parseFloat(value);
  return isNaN(n) ? "—" : `$${n.toLocaleString("es-CL")}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ValidatedBadge({ validated }: { validated: boolean }) {
  return validated ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Validado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Pendiente
    </span>
  );
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columns: Column<Payment>[] = [
  {
    key: "client_name",
    header: "Cliente",
    render: r => (
      <div className="flex flex-col gap-0.5 max-w-[200px]">
        <span className="font-medium text-gray-900 truncate" title={r.client_name ?? ""}>{r.client_name || "—"}</span>
        {r.client_ruc && (
          <span className="font-mono text-[11px] text-gray-400">{r.client_ruc}</span>
        )}
      </div>
    ),
    sortValue: r => r.client_name ?? "",
  },
  {
    key: "amount",
    header: "Monto",
    align: "right",
    render: r => <span className="font-semibold text-green-700">{formatCLP(r.amount)}</span>,
    sortValue: r => parseFloat(r.amount ?? "0"),
  },
  {
    key: "type_payment_name",
    header: "Método",
    render: r => r.type_payment_name
      ? <span className="text-xs text-gray-700">{r.type_payment_name}</span>
      : <span className="text-gray-300 text-xs">—</span>,
    sortValue: r => r.type_payment_name ?? "",
  },
  {
    key: "payment_date_estimated",
    header: "Fecha estimada",
    render: r => <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(r.payment_date_estimated)}</span>,
    sortValue: r => r.payment_date_estimated ?? "",
  },
  {
    key: "account_number",
    header: "N° Cuenta",
    render: r => r.account_number
      ? <span className="font-mono text-xs text-gray-600">{r.account_number}</span>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "email",
    header: "Email",
    render: r => r.email
      ? <a href={`mailto:${r.email}`} className="text-blue-600 hover:underline text-xs">{r.email}</a>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "created_by_name",
    header: "Registrado por",
    render: r => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-gray-700">{r.created_by_name || "—"}</span>
        {r.created_by_email && (
          <span className="text-[11px] text-gray-400">{r.created_by_email}</span>
        )}
      </div>
    ),
    sortValue: r => r.created_by_name ?? "",
  },
  {
    key: "validated",
    header: "Estado",
    align: "center",
    render: r => <ValidatedBadge validated={r.validated} />,
    sortValue: r => (r.validated ? 1 : 0),
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function PagosPage() {
  const [page,   setPage]   = useState(1);
  const [limit,  setLimit]  = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isError } = usePayments({ page, limit, search: search || undefined });

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
          Inicio / <span className="text-gray-700 font-medium">Pagos recibidos</span>
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Pagos recibidos</h1>
        <p className="mt-1 text-sm text-gray-500">
          {count > 0 ? `${count.toLocaleString("es-CL")} pagos registrados.` : "Pagos recibidos de clientes y su estado de validación."}
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          No se pudieron cargar los pagos. Intenta recargar la página.
        </div>
      ) : (
        <Table
          columns={columns}
          data={results}
          keyField="id"
          emptyMessage="No hay pagos registrados."
          searchPlaceholder="Buscar por cliente, RUT, cuenta…"
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
