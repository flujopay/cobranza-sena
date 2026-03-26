export const SESSION_COOKIE      = "msena_access";
export const REFRESH_COOKIE      = "msena_refresh";
export const COMPANY_ID_COOKIE   = "msena_company_id";

/** Opciones comunes para cookies de sesión */
export const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  // En producción: secure: true, maxAge: 60 * 60 * 8 (8h)
} as const;

/** Lee el access token de los headers de la request */
export function getSessionFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
