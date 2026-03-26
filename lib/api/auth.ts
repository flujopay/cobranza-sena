import { apiPost } from "./client";
import type { AuthTokens, LoginRequest, RegisterRequest } from "./types/auth";

const PREFIX = "/collection/auth";

export function register(data: RegisterRequest): Promise<AuthTokens> {
  return apiPost<AuthTokens>(`${PREFIX}/register/`, data);
}

export function login(data: LoginRequest): Promise<AuthTokens> {
  return apiPost<AuthTokens>(`${PREFIX}/login/`, data);
}
