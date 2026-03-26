"use client";

import { useForm } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useRegister, parseApiError } from "@/lib/hooks/useAuth";
import { isValidRut, formatRut, cleanRut } from "@/lib/rut";

type RegisterFields = {
  rut: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterFields>({ mode: "onChange" });

  const registerMutation = useRegister();
  const password = watch("password");

  async function onSubmit(data: RegisterFields) {
    try {
      await registerMutation.mutateAsync({
        rut: data.rut,
        email: data.email,
        password: data.password,
        password_confirm: data.confirmPassword,
      });
    } catch (err) {
      const fieldErrors = parseApiError(err);
      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof RegisterFields | "root", { message: msg });
      });
    }
  }

  function handleRutChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = cleanRut(e.target.value);
    const formatted = raw.length >= 2 ? formatRut(raw) : raw;
    setValue("rut", formatted, { shouldValidate: touchedFields.rut });
    e.target.value = formatted;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <InputField
        label="RUT"
        type="text"
        placeholder="12.345.678-9"
        autoComplete="off"
        error={errors.rut?.message}
        {...register("rut", {
          required: "El RUT es obligatorio.",
          validate: (v) => isValidRut(v) || "Ingresa un RUT chileno válido (ej: 12.345.678-9).",
        })}
        onChange={handleRutChange}
      />

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
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password", {
          required: "La contraseña es obligatoria.",
          minLength: { value: 8, message: "Mínimo 8 caracteres." },
        })}
      />

      <InputField
        label="Confirmar contraseña"
        type="password"
        placeholder="Repite tu contraseña"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Confirma tu contraseña.",
          validate: (val) => val === password || "Las contraseñas no coinciden.",
        })}
      />

      {errors.root && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </p>
      )}

      <SubmitButton
        label="Crear cuenta"
        loadingLabel="Registrando…"
        isLoading={isSubmitting || registerMutation.isPending}
      />
    </form>
  );
}
