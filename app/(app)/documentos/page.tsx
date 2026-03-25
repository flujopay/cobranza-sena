"use client";
import { Table, type Column } from "@/components/ui/Table";
import { MOCK_DOCUMENTOS, type Documento } from "@/lib/mock/documentos";

const ESTADO_STYLES: Record<Documento["estado"], string> = {
  Pendiente: "bg-blue-100 text-blue-700",
  Vencida:   "bg-red-100 text-red-700",
  Pagada:    "bg-green-100 text-green-700",
};

const columns: Column<Documento>[] = [
  { key: "folio",             header: "Folio" },
  { key: "cliente",           header: "Cliente" },
  { key: "rut_cliente",       header: "RUT" },
  { key: "fecha_emision",     header: "F. Emisión" },
  { key: "fecha_vencimiento", header: "F. Vencimiento" },
  {
    key: "monto", header: "Monto", align: "right",
    render: r => <span className="font-medium">${r.monto.toLocaleString("es-CL")}</span>,
    sortValue: r => r.monto,
  },
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

export default function DocumentosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">Inicio / <span className="text-gray-700 font-medium">Documentos emitidos</span></p>
        <h1 className="text-2xl font-semibold text-gray-900">Documentos emitidos</h1>
        <p className="mt-1 text-sm text-gray-500">Facturas emitidas importadas desde el SII.</p>
      </div>
      <Table columns={columns} data={MOCK_DOCUMENTOS} keyField="id" emptyMessage="No hay documentos registrados." />
    </div>
  );
}
