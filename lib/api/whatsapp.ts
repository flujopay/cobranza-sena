import { apiClient } from "./client";
import type {
  WhatsAppCreateResponse,
  WhatsAppStatusResponse,
  WhatsAppSendMessageRequest,
  WhatsAppSendMessageResponse,
  WhatsAppDeleteResponse,
} from "./types/whatsapp";

const PREFIX = "/collection/whatsapp";

export const createWhatsAppInstance = (): Promise<WhatsAppCreateResponse> =>
  apiClient.post<WhatsAppCreateResponse>(`${PREFIX}/create-instance/`).then((r) => r.data);

export const getWhatsAppStatus = (): Promise<WhatsAppStatusResponse> =>
  apiClient.get<WhatsAppStatusResponse>(`${PREFIX}/status/`).then((r) => r.data);

export const sendWhatsAppMessage = (body: WhatsAppSendMessageRequest): Promise<WhatsAppSendMessageResponse> =>
  apiClient.post<WhatsAppSendMessageResponse>(`${PREFIX}/send-message/`, body).then((r) => r.data);

export const deleteWhatsAppInstance = (): Promise<WhatsAppDeleteResponse> =>
  apiClient.delete<WhatsAppDeleteResponse>(`${PREFIX}/delete-instance/`).then((r) => r.data);
