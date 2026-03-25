// Session helpers — mock implementation
// TODO: replace with real JWT / NextAuth when backend is ready

export const SESSION_COOKIE = "msena_session";
export const SESSION_VALUE  = "authenticated"; // stub token

/** Lee la cookie de sesión desde los headers del request */
export function getSessionFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(`${SESSION_COOKIE}=`));
  return match ? match.split("=")[1] : null;
}
