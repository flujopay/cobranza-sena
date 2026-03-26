// ─── Bot de Cobranza (webhook externo) ──────────────────────────────────────

export interface CobranzaSuccessResponse {
  status: "ok";
  debtors_processed: number;
  messages_sent: number;
}

export interface CobranzaErrorResponse {
  status: "error";
  message: string;
}

export type CobranzaResponse = CobranzaSuccessResponse | CobranzaErrorResponse;

const COBRANZA_URL = "https://n8n.somossena.com/webhook/cobranza-sena";

export async function iniciarCobranza(token: string, companyId: number): Promise<CobranzaResponse> {
  const res = await fetch(COBRANZA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, company_id: String(companyId) }),
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
