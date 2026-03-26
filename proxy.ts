import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ["/login", "/registro"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar rutas públicas y assets
  const isPublic =
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = Boolean(session);

  // Sin sesión intentando acceder a ruta protegida → al login
  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Con sesión intentando acceder a login/registro → al inicio
  if (isAuthenticated && PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/clientes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas EXCEPTO:
     * - _next/static, _next/image, favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
