"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, REFRESH_COOKIE, COMPANY_ID_COOKIE, COOKIE_OPTS } from "@/lib/session";
import { isValidRut } from "@/lib/rut";
import { login, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export type AuthFormState = {
  errors?: Record<string, string>;
};

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email    = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }
  if (!password || password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const { access_token, refresh_token, company_id } = await login({ email, password });
    const jar = await cookies();
    jar.set(SESSION_COOKIE,    access_token,        COOKIE_OPTS);
    jar.set(REFRESH_COOKIE,    refresh_token,       COOKIE_OPTS);
    jar.set(COMPANY_ID_COOKIE, String(company_id),  { ...COOKIE_OPTS, httpOnly: false });
  } catch (err) {
    if (err instanceof ApiError) {
      const code = err.body.error_code;
      if (code === "USER_NOT_FOUND") return { errors: { email: "No existe una cuenta con este correo." } };
      if (code === "INVALID_CREDENTIALS") return { errors: { password: "Contraseña incorrecta." } };
      if (code === "PASSWORD_LOGIN_DISABLED") return { errors: { general: "Esta cuenta usa inicio de sesión con Google o Microsoft." } };
    }
    console.error("[loginAction] unexpected error:", err);
    return { errors: { general: String(err instanceof Error ? err.message : err) } };
  }

  redirect("/clientes");
}

// ─── Registro ─────────────────────────────────────────────────────────────────

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const rut             = (formData.get("rut") as string)?.trim();
  const email           = (formData.get("email") as string)?.trim();
  const password        = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Record<string, string> = {};

  if (!rut || !isValidRut(rut)) {
    errors.rut = "Ingresa un RUT chileno válido (ej: 12.345.678-9).";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }
  if (!password || password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const { access_token, refresh_token, company_id } = await register({
      email,
      password,
      password_confirm: confirmPassword,
      rut,
    });
    const jar = await cookies();
    jar.set(SESSION_COOKIE,    access_token,        COOKIE_OPTS);
    jar.set(REFRESH_COOKIE,    refresh_token,       COOKIE_OPTS);
    jar.set(COMPANY_ID_COOKIE, String(company_id),  { ...COOKIE_OPTS, httpOnly: false });
  } catch (err) {
    if (err instanceof ApiError) {
      const code = err.body.error_code;
      if (code === "RUT_ALREADY_EXISTS") return { errors: { rut: "Ya existe una empresa registrada con este RUT." } };
      const fieldErrors: Record<string, string> = {};
      for (const key of ["rut", "email", "password", "password_confirm"]) {
        const msg = err.fieldMessage(key);
        if (msg) fieldErrors[key === "password_confirm" ? "confirmPassword" : key] = msg;
      }
      if (Object.keys(fieldErrors).length > 0) return { errors: fieldErrors };
      return { errors: { general: err.message } };
    }
    console.error("[registerAction] unexpected error:", err);
    return { errors: { general: String(err instanceof Error ? err.message : err) } };
  }

  redirect("/clientes");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(COMPANY_ID_COOKIE);
  redirect("/login");
}
