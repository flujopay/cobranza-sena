"use client";

import { useState, useCallback } from "react";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { Table, type Column } from "@/components/ui/Table";
import type { Invoice } from "@/lib/api/types/invoices";

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

function StateBadge({ state }: { state: string | null }) {
  if (!state) return <span className="text-gray-300 text-xs">—</span>;
  const styles: Record<string, string> = {
    "Por gestionar":  "bg-blue-100 text-blue-700",
    "Pagada":         "bg-green-100 text-green-700",
    "Vencida":        "bg-red-100 text-red-700",
    "En proceso":     "bg-yellow-100 text-yellow-700",
  };
  const cls = styles[state] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cls}`}>
      {state}
    </span>
  );
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columns: Column<Invoice>[] = [
  {
    key: "invoice_number",
    header: "N° Factura",
    render: r => <span className="font-mono text-xs text-gray-700">{r.invoice_number || "—"}</span>,
  },
  {
    key: "client_business_name",
    header: "Cliente",
    render: r => (
      <div className="flex flex-col gap-0.5 max-w-[200px]">
        <span className="font-medium text-gray-900 truncate" title={r.client_business_name ?? ""}>
          {r.client_business_name || "—"}
        </span>
        {r.receiver_ruc && (
          <span className="font-mono text-[11px] text-gray-400">{r.receiver_ruc}</span>
        )}
      </div>
    ),
    sortValue: r => r.client_business_name ?? "",
  },
  {
    key: "type_document_name",
    header: "Tipo",
    render: r => <span className="text-xs text-gray-600">{r.type_document_name || "—"}</span>,
    sortValue: r => r.type_document_name ?? "",
  },
  {
    key: "issue_date",
    header: "Emisión",
    render: r => <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(r.issue_date)}</span>,
    sortValue: r => r.issue_date ?? "",
  },
  {
    key: "due_date",
    header: "Vencimiento",
    render: r => {
      if (!r.due_date) return <span className="text-gray-300 text-xs">—</span>;
      const isPast = new Date(r.due_date) < new Date();
      const hasPending = parseFloat(r.pending_balance ?? "0") > 0;
      return (
        <span className={`text-xs whitespace-nowrap ${isPast && hasPending ? "text-red-600 font-medium" : "text-gray-600"}`}>
          {formatDate(r.due_date)}
        </span>
      );
    },
    sortValue: r => r.due_date ?? "",
  },
  {
    key: "total_amount",
    header: "Total",
    align: "right",
    render: r => <span className="text-sm font-medium text-gray-800">{formatCLP(r.total_amount)}</span>,
    sortValue: r => parseFloat(r.total_amount ?? "0"),
  },
  {
    key: "paid_amount",
    header: "Pagado",
    align: "right",
    render: r => {
      const n = parseFloat(r.paid_amount ?? "0");
      return n > 0
        ? <span className="text-green-700 font-medium text-sm">{formatCLP(r.paid_amount)}</span>
        : <span className="text-gray-300 text-xs">$0</span>;
    },
    sortValue: r => parseFloat(r.paid_amount ?? "0"),
  },
  {
    key: "pending_balance",
    header: "Pendiente",
    align: "right",
    render: r => {
      const n = parseFloat(r.pending_balance ?? "0");
      return n > 0
        ? <span className="text-red-600 font-semibold text-sm">{formatCLP(r.pending_balance)}</span>
        : <span className="text-gray-300 text-xs">$0</span>;
    },
    sortValue: r => parseFloat(r.pending_balance ?? "0"),
  },
  {
    key: "management_state_name",
    header: "Estado",
    align: "center",
    render: r => <StateBadge state={r.management_state_name} />,
    sortValue: r => r.management_state_name ?? "",
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function DocumentosPage() {
  const [page,   setPage]   = useState(1);
  const [limit,  setLimit]  = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isError } = useInvoices({ page, limit, search: search || undefined });

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
          Inicio / <span className="text-gray-700 font-medium">Documentos emitidos</span>
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Documentos emitidos</h1>
        <p className="mt-1 text-sm text-gray-500">
          {count > 0 ? `${count.toLocaleString("es-CL")} facturas importadas desde el SII.` : "Facturas emitidas importadas desde el SII."}
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          No se pudieron cargar los documentos. Intenta recargar la página.
        </div>
      ) : (
        <Table
          columns={columns}
          data={results}
          keyField="id"
          emptyMessage="No hay documentos registrados."
          searchPlaceholder="Buscar por folio, cliente, RUT…"
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
