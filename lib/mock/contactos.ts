export type Contacto = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cliente: string;
  cargo: string;
  canal: "Email" | "WhatsApp" | "SMS" | "Email + WhatsApp";
};

export const MOCK_CONTACTOS: Contacto[] = [
  { id: 1, nombre: "Carlos",    apellido: "Muñoz",    email: "c.munoz@andina.cl",    telefono: "+56 9 8123 4567", cliente: "Constructora Andina SpA",   cargo: "Gerente Finanzas",  canal: "Email" },
  { id: 2, nombre: "María",     apellido: "Pérez",    email: "m.perez@dnorte.cl",    telefono: "+56 9 7654 3210", cliente: "Distribuidora del Norte",   cargo: "Jefa Contabilidad", canal: "Email + WhatsApp" },
  { id: 3, nombre: "Sebastián", apellido: "Torres",   email: "s.torres@tfuturo.cl",  telefono: "+56 9 6543 2109", cliente: "Tecnologías Futuro S.A.",   cargo: "Director Pagos",    canal: "Email + WhatsApp" },
  { id: 4, nombre: "Andrea",    apellido: "Gómez",    email: "a.gomez@mcentral.cl",  telefono: "+56 9 5432 1098", cliente: "Minera Central S.A.",       cargo: "Tesorera",          canal: "SMS" },
  { id: 5, nombre: "Felipe",    apellido: "Lagos",    email: "f.lagos@agropac.cl",   telefono: "+56 9 4321 0987", cliente: "Agro Pacífico Ltda.",       cargo: "Administrador",     canal: "Email" },
  { id: 6, nombre: "Valentina", apellido: "Rojas",    email: "v.rojas@lsur.cl",      telefono: "+56 9 3210 9876", cliente: "Logística Sur Express",     cargo: "Encargada Pagos",   canal: "WhatsApp" },
];
