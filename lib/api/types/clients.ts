// ─── Cliente ──────────────────────────────────────────────────────────────────

export interface Client {
  id: number;
  ruc: string;
  company_name: string | null;
  comercial_name: string | null;
  comercial_email: string | null;
  comercial_phone: string | null;
  ammount_total: string | null;
  ammount_paid: string | null;
  ammount_expired: string | null;
  ammount_current: string | null;
  ammount_debt: string | null;
  count_total: number | null;
  count_paid: number | null;
  count_expired: number | null;
  count_current: number | null;
  count_debt: number | null;
  created: string;
}
