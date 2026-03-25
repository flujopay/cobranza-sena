"use client";
import { Table, type Column } from "@/components/ui/Table";
import { MOCK_PAGOS, type Pago } from "@/lib/mock/pagos";

const ESTADO_STYLES: Record<Pago["estado"], string> = {
  "Conciliado":    "bg-green-100 text-green-700",
  "Sin conciliar": "bg-yellow-100 text-yellow-700",
  "En proceso":    "bg-blue-100 text-blue-700",
};

const columns: Column<Pago>[] = [
  { key: "referencia",  header: "Referencia" },
  { key: "cliente",     header: "Cliente" },
  { key: "rut_cliente", header: "RUT" },
  { key: "fecha",       header: "Fecha" },
  {
    key: "monto", header: "Monto", align: "right",
    render: r => <span className="font-medium text-green-700">${r.monto.toLocaleString("es-CL")}</span>,
    sortValue: r => r.monto,
  },
  { key: "metodo", header: "Método" },
  {
    key: "estado", header: "Estado", align: "center",
    render: r => (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_STYLES[r.estado]}`}>
        {r.estado}
      </span>
    ),
    sortValue: r => r.estado,
  },
];

export default function PagosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">Inicio / <span className="text-gray-700 font-medium">Pagos recibidos</span></p>
        <h1 className="text-2xl font-semibold text-gray-900">Pagos recibidos</h1>
        <p className="mt-1 text-sm text-gray-500">Pagos recibidos de clientes y su estado de conciliación.</p>
      </div>
      <Table columns={columns} data={MOCK_PAGOS} keyField="id" emptyMessage="No hay pagos registrados." />
    </div>
  );
}
