export type Pago = {
  id: number;
  referencia: string;
  cliente: string;
  rut_cliente: string;
  fecha: string;
  monto: number;
  metodo: "Transferencia" | "Khipu" | "Cheque";
  estado: "Conciliado" | "Sin conciliar" | "En proceso";
};

export const MOCK_PAGOS: Pago[] = [
  { id: 1, referencia: "PAG-0041", cliente: "Constructora Andina SpA",   rut_cliente: "76.543.210-K", fecha: "2026-02-15", monto: 1200000,  metodo: "Transferencia", estado: "Conciliado" },
  { id: 2, referencia: "PAG-0042", cliente: "Agro Pacífico Ltda.",       rut_cliente: "33.445.566-7", fecha: "2026-01-28", monto: 2100000,  metodo: "Khipu",         estado: "Conciliado" },
  { id: 3, referencia: "PAG-0043", cliente: "Logística Sur Express",     rut_cliente: "22.334.455-8", fecha: "2026-03-02", monto: 3000000,  metodo: "Transferencia", estado: "Sin conciliar" },
  { id: 4, referencia: "PAG-0044", cliente: "Distribuidora del Norte",   rut_cliente: "12.345.678-9", fecha: "2026-03-10", monto: 900000,   metodo: "Cheque",        estado: "En proceso" },
  { id: 5, referencia: "PAG-0045", cliente: "Tecnologías Futuro S.A.",   rut_cliente: "88.901.234-5", fecha: "2026-03-18", monto: 2000000,  metodo: "Transferencia", estado: "Sin conciliar" },
];
