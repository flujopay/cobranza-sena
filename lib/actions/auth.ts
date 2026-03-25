"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_VALUE } from "@/lib/session";

export type AuthFormState = {
  errors?: Record<string, string>;
};

// ─── Login ───────────────────────────────────────────────────────────────────

/** Mock credentials — replace with real DB/JWT check */
const MOCK_EMAIL    = "demo@minisena.cl";
const MOCK_PASSWORD = "sena1234";

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

  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    return { errors: { general: "Credenciales incorrectas." } };
  }

  // Escribir cookie de sesión (httpOnly, sameSite strict)
  const jar = await cookies();
  jar.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    // En producción agregar: secure: true, maxAge: 60 * 60 * 8 (8h)
  });

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

  if (!rut || rut.length < 8) {
    errors.rut = "Ingresa un RUT válido (ej: 12.345.678-9).";
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

  // TODO: crear usuario en backend

  const jar = await cookies();
  jar.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  redirect("/clientes");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}
