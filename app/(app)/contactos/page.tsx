"use client";
import { Table, type Column } from "@/components/ui/Table";
import { MOCK_CONTACTOS, type Contacto } from "@/lib/mock/contactos";

const CANAL_STYLES: Record<Contacto["canal"], string> = {
  "Email":            "bg-blue-100 text-blue-700",
  "WhatsApp":         "bg-green-100 text-green-700",
  "SMS":              "bg-purple-100 text-purple-700",
  "Email + WhatsApp": "bg-orange-100 text-orange-700",
};

const columns: Column<Contacto>[] = [
  {
    key: "nombre", header: "Nombre",
    render: r => <span className="font-medium text-gray-900">{r.nombre} {r.apellido}</span>,
    sortValue: r => `${r.nombre} ${r.apellido}`,
  },
  { key: "email",    header: "Email" },
  { key: "telefono", header: "Teléfono" },
  { key: "cliente",  header: "Cliente" },
  { key: "cargo",    header: "Cargo" },
  {
    key: "canal", header: "Canal", align: "center",
    render: r => (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${CANAL_STYLES[r.canal]}`}>
        {r.canal}
      </span>
    ),
    sortValue: r => r.canal,
  },
];

export default function ContactosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">Inicio / <span className="text-gray-700 font-medium">Contactos</span></p>
        <h1 className="text-2xl font-semibold text-gray-900">Contactos</h1>
        <p className="mt-1 text-sm text-gray-500">Personas de contacto por cliente para gestionar la cobranza.</p>
      </div>
      <Table columns={columns} data={MOCK_CONTACTOS} keyField="id" emptyMessage="No hay contactos registrados." />
    </div>
  );
}
