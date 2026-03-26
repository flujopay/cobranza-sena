// ─── Requests ─────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  rut: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  company_id: number;
}

export interface WhatsAppStatus {
  connected: boolean;
  phone: string | null;
}

export interface Company {
  id: number;
  ruc: string;
  company_name: string;
  comercial_name: string;
  comercial_email: string;
  comercial_phone: string;
  photo: string | null;
  company_user_id: number;
  has_sii_credentials: boolean;
  whatsapp: WhatsAppStatus;
}

export interface MeResponse {
  id: number;
  email: string;
  name: string;
  lastname: string;
  photo: string | null;
  country: number | null;
  companies: Company[];
}

// ─── Errores de la API ────────────────────────────────────────────────────────

export type ApiErrorCode =
  | "RUT_ALREADY_EXISTS"
  | "USER_NOT_FOUND"
  | "PASSWORD_LOGIN_DISABLED"
  | "INVALID_CREDENTIALS";

export interface ApiErrorResponse {
  error_code?: ApiErrorCode;
  error_message?: string;
  /** Errores de campo (ej: { rut: ["RUT inválido"] }) */
  [field: string]: string | string[] | ApiErrorCode | undefined;
}
