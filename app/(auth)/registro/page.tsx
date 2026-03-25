import Link from "next/link";
import { SenaLogo } from "@/components/ui/SenaLogo";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Logo */}
      <SenaLogo />

      {/* Card */}
      <div className="w-full rounded-2xl bg-white shadow-2xl px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Ingresa tus datos para comenzar.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
