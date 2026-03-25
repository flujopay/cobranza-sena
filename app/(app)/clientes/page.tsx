"use client";
import { Table, type Column } from "@/components/ui/Table";
import { MOCK_CLIENTES, type Cliente } from "@/lib/mock/clientes";

const NIVEL_STYLES: Record<Cliente["nivel"], string> = {
  Verde:    "bg-green-100 text-green-700",
  Amarillo: "bg-yellow-100 text-yellow-700",
  Naranja:  "bg-orange-100 text-orange-700",
  Rojo:     "bg-red-100 text-red-700",
};

const columns: Column<Cliente>[] = [
  { key: "rut",          header: "RUT" },
  { key: "razon_social", header: "Razón Social" },
  { key: "email",        header: "Email" },
  { key: "telefono",     header: "Teléfono" },
  {
    key: "deuda_total", header: "Deuda Total", align: "right",
    render: r => <span className="font-medium">${r.deuda_total.toLocaleString("es-CL")}</span>,
    sortValue: r => r.deuda_total,
  },
  {
    key: "pagado", header: "Pagado", align: "right",
    render: r => <span className="text-green-700">${r.pagado.toLocaleString("es-CL")}</span>,
    sortValue: r => r.pagado,
  },
  {
    key: "score", header: "Score", align: "center",
    render: r => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${NIVEL_STYLES[r.nivel]}`}>
        {r.score} — {r.nivel}
      </span>
    ),
    sortValue: r => r.score,
  },
];

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">Inicio / <span className="text-gray-700 font-medium">Clientes</span></p>
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <p className="mt-1 text-sm text-gray-500">Listado de clientes con deuda activa y su score de riesgo.</p>
      </div>
      <Table columns={columns} data={MOCK_CLIENTES} keyField="id" emptyMessage="No hay clientes registrados." />
    </div>
  );
}
