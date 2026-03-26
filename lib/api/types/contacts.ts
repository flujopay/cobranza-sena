// ─── Contacto ─────────────────────────────────────────────────────────────────

export interface Contact {
  id: number;
  name: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  ruc: string | null;
  position: string | null;
  area: string | null;
  client_ruc: string | null;
  client_name: string | null;
  created: string;
}
