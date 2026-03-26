// ─── Factura ──────────────────────────────────────────────────────────────────

export interface Invoice {
  id: number;
  invoice_number: string | null;
  serial_number: string | null;
  issue_date: string | null;
  due_date: string | null;
  total_amount: string | null;
  net_amount: string | null;
  vat: string | null;
  paid_amount: string | null;
  pending_balance: string | null;
  issuer_ruc: string | null;
  receiver_ruc: string | null;
  client_business_name: string | null;
  client_comercial_name: string | null;
  management_state_name: string | null;
  type_document_name: string | null;
  currency_code: string | null;
  currency_symbol: string | null;
  created: string;
}
