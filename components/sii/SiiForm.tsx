"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useModalStore } from "@/store/modalStore";
import { isValidRut, formatRut, cleanRut } from "@/lib/rut";
import { useSiiStatus, useSaveSiiCreds, useDeleteSiiCreds } from "@/lib/hooks/useSii";
import { useToastStore } from "@/store/toastStore";
import { ApiError } from "@/lib/api/client";

type SiiFields = {
  rut: string;
  clave: string;
};

// ─── Estado: conectado ────────────────────────────────────────────────────────

function SiiConnected({ rut, onDisconnect, isDeleting }: { rut: string; onDisconnect: () => void; isDeleting: boolean }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Badge conectado */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">SII conectado</p>
          <p className="text-xs text-green-600 mt-0.5">RUT: <span className="font-mono font-medium">{rut}</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Tu empresa está autenticada con el SII. Las credenciales se almacenan encriptadas en nuestros servidores.
      </p>

      {/* Desconexión */}
      {!confirm ? (
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="self-start text-sm text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer underline underline-offset-2"
        >
          Desconectar SII
        </button>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-3">
          <p className="text-sm text-red-700 font-medium">¿Seguro que deseas eliminar las credenciales SII?</p>
          <p className="text-xs text-red-500">Esta acción no se puede deshacer. Deberás volver a ingresar tus credenciales para sincronizar documentos.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDisconnect}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isDeleting ? "Eliminando…" : "Sí, desconectar"}
            </button>
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Formulario principal ─────────────────────────────────────────────────────

export function SiiForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { hideModal }   = useModalStore();
  const { showToast }   = useToastStore();

  const { data: status, isLoading: loadingStatus } = useSiiStatus();
  const saveMutation   = useSaveSiiCreds();
  const deleteMutation = useDeleteSiiCreds();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SiiFields>({ mode: "onChange" });

  async function onSubmit(data: SiiFields) {
    setServerError(null);
    try {
      await saveMutation.mutateAsync({ rut: data.rut, password: data.clave });
      showToast({ message: "SII conectado", subMessage: "Credenciales guardadas correctamente.", iconType: "success" });
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = err.fieldMessage("rut") ?? err.fieldMessage("password") ?? err.message;
        setServerError(msg);
        showToast({ message: "Error al conectar SII", subMessage: msg, iconType: "error" });
      } else {
        setServerError("Error inesperado. Intenta nuevamente.");
        showToast({ message: "Error inesperado", subMessage: "Intenta nuevamente.", iconType: "error" });
      }
    }
  }

  async function handleDisconnect() {
    try {
      await deleteMutation.mutateAsync();
      showToast({ message: "SII desconectado", subMessage: "Las credenciales fueron eliminadas.", iconType: "success" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "No se pudo desconectar.";
      showToast({ message: "Error al desconectar", subMessage: msg, iconType: "error" });
    }
  }

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center py-10 gap-3 text-gray-400">
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <span className="text-sm">Verificando estado SII…</span>
      </div>
    );
  }

  // ─── Ya conectado → mostrar estado + desconexión ───────────────────────────

  if (status?.has_credentials) {
    return (
      <SiiConnected
        rut={status.rut ?? ""}
        onDisconnect={handleDisconnect}
        isDeleting={deleteMutation.isPending}
      />
    );
  }

  // ─── Guardado exitoso ──────────────────────────────────────────────────────

  if (saveMutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-semibold text-gray-900">Credenciales guardadas</p>
        <p className="text-sm text-gray-500 max-w-xs">
          Tu empresa está conectada al SII. Ya puedes sincronizar documentos.
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
    );
  }

  // ─── Formulario de conexión ────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <InputField
        label="RUT de acceso SII"
        type="text"
        placeholder="12.345.678-9"
        autoComplete="off"
        error={errors.rut?.message}
        {...register("rut", {
          required: "El RUT es obligatorio.",
          validate: (v) => isValidRut(v) || "Ingresa un RUT chileno válido.",
        })}
        onChange={(e) => {
          const formatted = formatRut(cleanRut(e.target.value));
          setValue("rut", formatted, { shouldValidate: true });
          e.target.value = formatted;
        }}
      />

      <InputField
        label="Clave SII"
        type="password"
        placeholder="Tu clave tributaria"
        autoComplete="current-password"
        error={errors.clave?.message}
        {...register("clave", {
          required: "La clave SII es obligatoria.",
          minLength: { value: 4, message: "Ingresa tu clave SII." },
        })}
      />

      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
          <svg className="shrink-0 text-red-500 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <SubmitButton
        label="Guardar credenciales"
        loadingLabel="Guardando…"
        isLoading={isSubmitting || saveMutation.isPending}
      />
    </form>
  );
}
