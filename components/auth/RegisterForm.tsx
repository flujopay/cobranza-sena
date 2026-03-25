"use client";

import { useForm } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { registerAction } from "@/lib/actions/auth";

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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>();

  async function onSubmit(data: RegisterFields) {
    const formData = new FormData();
    formData.set("rut", data.rut);
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("confirmPassword", data.confirmPassword);
    const result = await registerAction({}, formData);
    if (result?.errors) {
      Object.entries(result.errors).forEach(([field, msg]) => {
        setError(field as keyof RegisterFields, { message: msg });
      });
    }
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
          minLength: { value: 8, message: "Ingresa un RUT válido (ej: 12.345.678-9)." },
        })}
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
          validate: (val) => val === watch("password") || "Las contraseñas no coinciden.",
        })}
      />

      <SubmitButton label="Crear cuenta" loadingLabel="Registrando…" isLoading={isSubmitting} />
    </form>
  );
}
