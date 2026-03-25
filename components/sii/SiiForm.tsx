"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useModalStore } from "@/store/modalStore";

type SiiFields = {
  rut: string;
  clave: string;
};

type Status = "idle" | "loading" | "success" | "error";

export function SiiForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const { hideModal } = useModalStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiiFields>();

  async function onSubmit(_data: SiiFields) {
    setStatus("loading");
    // TODO: enviar credenciales al backend para verificar con SII
    await new Promise((r) => setTimeout(r, 1500)); // simulación
    setStatus("success");
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Credenciales SII
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Ingresa el RUT y la clave tributaria de tu empresa para autenticar con el SII.
      </p>

      {status === "success" ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="text-green-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900">Conexión exitosa</p>
          <p className="text-sm text-gray-500 max-w-xs">
            Tu empresa está conectada al SII. Puedes continuar a la importación de facturas.
          </p>
          <button
            onClick={hideModal}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
          >
            Cerrar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <InputField
            label="RUT Empresa"
            type="text"
            placeholder="76.123.456-7"
            autoComplete="off"
            error={errors.rut?.message}
            {...register("rut", {
              required: "El RUT de la empresa es obligatorio.",
              minLength: { value: 8, message: "Ingresa un RUT válido (ej: 76.123.456-7)." },
            })}
          />

          {/* Campo clave con toggle de visibilidad */}
          <div className="relative">
            <InputField
              label="Clave SII"
              type={showPassword ? "text" : "password"}
              placeholder="Tu clave tributaria"
              autoComplete="current-password"
              error={errors.clave?.message}
              {...register("clave", {
                required: "La clave SII es obligatoria.",
                minLength: { value: 4, message: "Ingresa tu clave SII." },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {status === "error" && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
              <svg className="shrink-0 text-red-500 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-700">
                No se pudo autenticar con el SII. Verifica tu RUT y clave tributaria.
              </p>
            </div>
          )}

          <SubmitButton
            label="Autenticar con SII"
            loadingLabel="Verificando credenciales…"
            isLoading={isSubmitting || status === "loading"}
          />
        </form>
      )}
    </div>
  );
}
