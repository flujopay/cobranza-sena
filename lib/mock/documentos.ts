export type Documento = {
  id: number;
  folio: string;
  cliente: string;
  rut_cliente: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  monto: number;
  estado: "Pendiente" | "Vencida" | "Pagada";
};

export const MOCK_DOCUMENTOS: Documento[] = [
  { id: 1, folio: "FAC-001",  cliente: "Constructora Andina SpA",    rut_cliente: "76.543.210-K", fecha_emision: "2026-01-10", fecha_vencimiento: "2026-02-10", monto: 1200000, estado: "Vencida" },
  { id: 2, folio: "FAC-002",  cliente: "Distribuidora del Norte",    rut_cliente: "12.345.678-9", fecha_emision: "2026-01-15", fecha_vencimiento: "2026-02-15", monto: 3600000, estado: "Vencida" },
  { id: 3, folio: "FAC-003",  cliente: "Tecnologías Futuro S.A.",    rut_cliente: "88.901.234-5", fecha_emision: "2026-02-01", fecha_vencimiento: "2026-03-01", monto: 5800000, estado: "Vencida" },
  { id: 4, folio: "FAC-004",  cliente: "Minera Central S.A.",        rut_cliente: "55.112.233-4", fecha_emision: "2026-02-10", fecha_vencimiento: "2026-03-10", monto: 12000000, estado: "Pendiente" },
  { id: 5, folio: "FAC-005",  cliente: "Agro Pacífico Ltda.",        rut_cliente: "33.445.566-7", fecha_emision: "2025-12-01", fecha_vencimiento: "2026-01-01", monto: 2100000, estado: "Pagada" },
  { id: 6, folio: "FAC-006",  cliente: "Logística Sur Express",      rut_cliente: "22.334.455-8", fecha_emision: "2026-01-20", fecha_vencimiento: "2026-02-20", monto: 4400000, estado: "Vencida" },
  { id: 7, folio: "FAC-007",  cliente: "Constructora Andina SpA",    rut_cliente: "76.543.210-K", fecha_emision: "2026-03-01", fecha_vencimiento: "2026-04-01", monto: 3600000, estado: "Pendiente" },
];
