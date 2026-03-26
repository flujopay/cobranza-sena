"use client";

import { create } from "zustand";
import type { Company } from "@/lib/api/types/auth";

const ACCESS_COOKIE    = "msena_access";
const REFRESH_COOKIE   = "msena_refresh";
const COMPANY_COOKIE   = "msena_company_id";
const COOKIE_MAX_AGE   = 60 * 60 * 8; // 8 horas

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};samesite=strict`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0`;
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

type AuthState = {
  accessToken:    string | null;
  refreshToken:   string | null;
  companyId:      number | null;
  activeCompany:  Company | null;

  setSession: (tokens: { access_token: string; refresh_token: string; company_id: number }) => void;
  /** Sincroniza activeCompany cuando llega /me. Llama esto desde useMe. */
  setActiveCompany: (companies: Company[], companyId: number) => void;
  clearSession: () => void;
  /** Carga tokens desde cookies al montar (hidratación) */
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken:   null,
  refreshToken:  null,
  companyId:     null,
  activeCompany: null,

  setSession({ access_token, refresh_token, company_id }) {
    setCookie(ACCESS_COOKIE,  access_token);
    setCookie(REFRESH_COOKIE, refresh_token);
    setCookie(COMPANY_COOKIE, String(company_id));
    set({ accessToken: access_token, refreshToken: refresh_token, companyId: company_id });
  },

  setActiveCompany(companies, companyId) {
    const found = companies.find((c) => c.id === companyId) ?? companies[0] ?? null;
    // Solo actualiza si cambió (evita re-renders innecesarios)
    if (found?.id !== get().activeCompany?.id || found?.whatsapp.connected !== get().activeCompany?.whatsapp.connected) {
      set({ activeCompany: found });
    }
  },

  clearSession() {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
    deleteCookie(COMPANY_COOKIE);
    set({ accessToken: null, refreshToken: null, companyId: null, activeCompany: null });
  },

  hydrate() {
    const accessToken  = getCookie(ACCESS_COOKIE);
    const refreshToken = getCookie(REFRESH_COOKIE);
    const companyId    = getCookie(COMPANY_COOKIE);
    set({
      accessToken,
      refreshToken,
      companyId: companyId ? Number(companyId) : null,
    });
  },
}));
