"use client";

import { useState } from "react";
import { useRuns } from "@/lib/hooks/useRuns";
import { Table, type Column } from "@/components/ui/Table";
import type { CollectionRun } from "@/lib/api/types/runs";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function duration(started: string, finished: string | null) {
  if (!finished) return null;
  const secs = Math.round((new Date(finished).getTime() - new Date(started).getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function StatusBadge({ status }: { status: CollectionRun["status"] }) {
  const map = {
    running:   { label: "En curso",   cls: "bg-blue-100 text-blue-700" },
    completed: { label: "Completada", cls: "bg-green-100 text-green-700" },
    failed:    { label: "Fallida",    cls: "bg-red-100 text-red-600" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {status === "running" && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
      )}
      {label}
    </span>
  );
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columns: Column<CollectionRun>[] = [
  {
    key: "started_at",
    header: "Inicio",
    render: r => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-gray-800">{formatDate(r.started_at).split(",")[0]}</span>
        <span className="text-[11px] text-gray-400">{formatDate(r.started_at).split(",")[1]?.trim()}</span>
      </div>
    ),
    sortValue: r => r.started_at,
  },
  {
    key: "finished_at",
    header: "Fin",
    render: r => {
      if (!r.finished_at) return <span className="text-gray-400 text-xs italic">En curso…</span>;
      const parts = formatDate(r.finished_at).split(",");
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-800">{parts[0]}</span>
          <span className="text-[11px] text-gray-400">{parts[1]?.trim()}</span>
        </div>
      );
    },
    sortValue: r => r.finished_at ?? "",
  },
  {
    key: "uuid",
    header: "Duración",
    render: r => {
      const d = duration(r.started_at, r.finished_at);
      if (!d) return <span className="text-gray-400 text-xs italic">—</span>;
      return <span className="text-xs font-mono text-gray-600">{d}</span>;
    },
  },
  {
    key: "status",
    header: "Estado",
    render: r => <StatusBadge status={r.status} />,
  },
  {
    key: "debtors_processed",
    header: "Deudores",
    align: "right",
    render: r => <span className="text-xs font-medium text-gray-700">{r.debtors_processed}</span>,
    sortValue: r => r.debtors_processed,
  },
  {
    key: "messages_email",
    header: "Email",
    align: "right",
    render: r => <span className="text-xs text-gray-600">{r.messages_email}</span>,
    sortValue: r => r.messages_email,
  },
  {
    key: "messages_whatsapp",
    header: "WhatsApp",
    align: "right",
    render: r => <span className="text-xs text-gray-600">{r.messages_whatsapp}</span>,
    sortValue: r => r.messages_whatsapp,
  },
  {
    key: "messages_sms",
    header: "SMS",
    align: "right",
    render: r => <span className="text-xs text-gray-600">{r.messages_sms}</span>,
    sortValue: r => r.messages_sms,
  },
  {
    key: "error_message",
    header: "Error",
    render: r => r.error_message
      ? <span className="text-xs text-red-600 truncate max-w-[200px] block" title={r.error_message}>{r.error_message}</span>
      : <span className="text-gray-300 text-xs">—</span>,
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function EjecucionesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useRuns(page);

  const results    = data?.results     ?? [];
  const count      = data?.count       ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const limit      = data?.limit       ?? 20;
  const from       = count === 0 ? 0 : (page - 1) * limit + 1;
  const to         = Math.min(page * limit, count);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">
          Inicio / <span className="text-gray-700 font-medium">Ejecuciones</span>
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Ejecuciones del Agente</h1>
        <p className="mt-1 text-sm text-gray-500">
          Historial de ejecuciones del agente de cobranza.
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          No se pudieron cargar las corridas. Intenta recargar la página.
        </div>
      ) : (
        <Table
          columns={columns}
          data={results}
          keyField="id"
          emptyMessage="No hay ejecuciones registradas."
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
            onLimitChange: () => {},
          }}
        />
      )}
    </div>
  );
}
