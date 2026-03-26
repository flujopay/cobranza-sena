import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "./types/auth";

// ─── Error tipado ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorResponse
  ) {
    super(body.error_message ?? `API error ${status}`);
    this.name = "ApiError";
  }

  fieldMessage(field: string): string | undefined {
    const val = this.body[field];
    if (!val) return undefined;
    return Array.isArray(val) ? val[0] : String(val);
  }
}

// ─── Instancia base ────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://dev.mv.flujolink.com/api/v1",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor ───────────────────────────────────────────────────────
// Lee tokens del authStore (browser) e inyecta headers automáticamente

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    // Import dinámico para evitar problemas de inicialización circular
    const { useAuthStore } = require("@/store/authStore");
    const { accessToken, companyId } = useAuthStore.getState();

    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    if (companyId)   config.headers["X-Company-Id"]  = String(companyId);
  }
  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      throw new ApiError(error.response.status, error.response.data ?? {});
    }
    if (error.request) {
      throw new ApiError(0, { error_message: `Sin respuesta del servidor: ${error.message}` });
    }
    throw new ApiError(0, { error_message: error.message });
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const apiGet = <T>(path: string) =>
  apiClient.get<T>(path).then((r) => r.data);

export const apiPost = <T>(path: string, body: unknown) =>
  apiClient.post<T>(path, body).then((r) => r.data);

export const apiPatch = <T>(path: string, body: unknown) =>
  apiClient.patch<T>(path, body).then((r) => r.data);

export const apiDelete = <T>(path: string) =>
  apiClient.delete<T>(path).then((r) => r.data);
