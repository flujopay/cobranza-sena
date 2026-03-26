"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api/client";
import type { LoginRequest, RegisterRequest } from "@/lib/api/types/auth";

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const { setSession } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess(tokens) {
      setSession(tokens);
      queryClient.clear(); // limpia cache de sesión anterior
      router.push("/clientes");
    },
  });
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  const { setSession } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess(tokens) {
      setSession(tokens);
      router.push("/clientes");
    },
  });
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const { clearSession } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    clearSession();
    queryClient.clear();
    router.push("/login");
  };
}

// ─── Utilidad para mapear ApiError a errores de campo ─────────────────────────

export function parseApiError(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError)) return { general: String(err) };

  const code = err.body.error_code;
  if (code === "INVALID_CREDENTIALS") return { password: "Contraseña incorrecta." };
  if (code === "USER_NOT_FOUND")       return { email: "No existe una cuenta con este correo." };
  if (code === "PASSWORD_LOGIN_DISABLED") return { general: "Esta cuenta usa Google o Microsoft para iniciar sesión." };
  if (code === "RUT_ALREADY_EXISTS")   return { rut: "Ya existe una empresa registrada con este RUT." };

  // Errores de campo del servidor (ej: { rut: ["RUT no encontrado en el SII."] })
  const fieldErrors: Record<string, string> = {};
  for (const key of ["rut", "email", "password", "password_confirm"]) {
    const msg = err.fieldMessage(key);
    if (msg) fieldErrors[key === "password_confirm" ? "confirmPassword" : key] = msg;
  }
  if (Object.keys(fieldErrors).length > 0) return fieldErrors;

  return { general: err.message };
}
