// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export type WhatsAppInstanceStatus = "none" | "qr" | "ready" | "disconnected";

export interface WhatsAppQrData {
  sessionId: string;
  status: string;
  qr: string;
  dataURL: string;
}

/** POST /collection/whatsapp/create-instance/ */
export interface WhatsAppCreateResponse extends WhatsAppQrData {}

/** GET /collection/whatsapp/status/ */
export interface WhatsAppStatusResponse {
  connected: boolean;
  status: WhatsAppInstanceStatus;
  phone: string | null;
  qr?: WhatsAppQrData | null;
}

/** POST /collection/whatsapp/send-message/ */
export interface WhatsAppSendMessageRequest {
  phone_number: string;
  message: string;
}

export interface WhatsAppSendMessageResponse {
  key: { remoteJid: string; fromMe: boolean; id: string };
  message: { conversation: string };
  messageTimestamp: string;
  status: string;
}

/** DELETE /collection/whatsapp/delete-instance/ */
export interface WhatsAppDeleteResponse {
  status: "SUCCESS";
}
