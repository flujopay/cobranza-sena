// ─── Pago ─────────────────────────────────────────────────────────────────────

export interface Payment {
  id: number;
  amount: string | null;
  payment_date_estimated: string | null;
  validated: boolean;
  client_ruc: string | null;
  client_name: string | null;
  type_payment_name: string | null;
  account_number: string | null;
  email: string | null;
  created_by_name: string | null;
  created_by_email: string | null;
  created: string;
}
