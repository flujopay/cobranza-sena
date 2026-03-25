import Link from "next/link";
import { SenaLogo } from "@/components/ui/SenaLogo";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Logo */}
      <SenaLogo />

      {/* Card */}
      <div className="w-full rounded-2xl bg-white shadow-2xl px-8 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Iniciar Sesión
        </h1>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
