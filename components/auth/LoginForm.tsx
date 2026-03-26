"use client";

import { useForm } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useLogin, parseApiError } from "@/lib/hooks/useAuth";

type LoginFields = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ mode: "onChange" });

  const loginMutation = useLogin();

  async function onSubmit(data: LoginFields) {
    try {
      await loginMutation.mutateAsync(data);
    } catch (err) {
      const fieldErrors = parseApiError(err);
      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof LoginFields | "root", { message: msg });
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <InputField
        label="Correo electrónico"
        type="email"
        placeholder="nombre@empresa.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: "El correo es obligatorio.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Ingresa un correo electrónico válido.",
          },
        })}
      />

      <InputField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: "La contraseña es obligatoria.",
          minLength: { value: 6, message: "Mínimo 6 caracteres." },
        })}
      />

      <div className="flex justify-end -mt-1">
        <button
          type="button"
          className="text-xs text-blue-600 hover:text-blue-500 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {errors.root && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </p>
      )}

      <SubmitButton
        label="Continuar"
        loadingLabel="Verificando…"
        isLoading={isSubmitting || loginMutation.isPending}
      />
    </form>
  );
}
