export type Cliente = {
  id: number;
  rut: string;
  razon_social: string;
  email: string;
  telefono: string;
  deuda_total: number;
  pagado: number;
  score: number;
  nivel: "Verde" | "Amarillo" | "Naranja" | "Rojo";
};

export const MOCK_CLIENTES: Cliente[] = [
  { id: 1, rut: "76.543.210-K", razon_social: "Constructora Andina SpA", email: "contacto@andina.cl", telefono: "+56 9 8123 4567", deuda_total: 4800000, pagado: 1200000, score: 22, nivel: "Verde" },
  { id: 2, rut: "12.345.678-9", razon_social: "Distribuidora del Norte Ltda.", email: "admin@dnorte.cl", telefono: "+56 9 7654 3210", deuda_total: 9200000, pagado: 0, score: 47, nivel: "Amarillo" },
  { id: 3, rut: "88.901.234-5", razon_social: "Tecnologías Futuro S.A.", email: "pagos@tfuturo.cl", telefono: "+56 9 6543 2109", deuda_total: 15600000, pagado: 2000000, score: 61, nivel: "Naranja" },
  { id: 4, rut: "55.112.233-4", razon_social: "Minera Central S.A.", email: "finanzas@mcentral.cl", telefono: "+56 9 5432 1098", deuda_total: 32000000, pagado: 0, score: 83, nivel: "Rojo" },
  { id: 5, rut: "33.445.566-7", razon_social: "Agro Pacífico Ltda.", email: "cuentas@agropac.cl", telefono: "+56 9 4321 0987", deuda_total: 2100000, pagado: 2100000, score: 5, nivel: "Verde" },
  { id: 6, rut: "22.334.455-8", razon_social: "Logística Sur Express", email: "operaciones@lsur.cl", telefono: "+56 9 3210 9876", deuda_total: 7400000, pagado: 3000000, score: 38, nivel: "Amarillo" },
];
