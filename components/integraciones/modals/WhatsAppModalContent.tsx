"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "@/store/modalStore";
import { useToastStore } from "@/store/toastStore";
import { ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/keys";
import {
  useWhatsAppStatus,
  useCreateWhatsAppInstance,
  useDeleteWhatsAppInstance,
} from "@/lib/hooks/useWhatsApp";
import { useAuthStore } from "@/store/authStore";

// ─── Estado: conectado ────────────────────────────────────────────────────────

function WhatsAppConnected({
  phone,
  onDisconnect,
  isDeleting,
}: {
  phone: string | null;
  onDisconnect: () => void;
  isDeleting: boolean;
}) {
  const { hideModal } = useModalStore();

  return (
    <div className="flex flex-col gap-5 px-6 py-5">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">WhatsApp conectado</p>
          {phone && <p className="text-xs text-green-600 mt-0.5 font-mono">{phone}</p>}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Tu WhatsApp está vinculado. Ya puedes enviar mensajes de cobranza directamente a tus clientes.
      </p>

      <button
        onClick={hideModal}
        className="self-start text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
      >
        Cerrar
      </button>

      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={onDisconnect}
          disabled={isDeleting}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors underline underline-offset-2 disabled:opacity-50"
        >
          {isDeleting ? "Desconectando…" : "Desconectar WhatsApp"}
        </button>
      </div>
    </div>
  );
}

// ─── Estado: QR listo para escanear ──────────────────────────────────────────

function WhatsAppQr({
  dataURL,
  onRefresh,
}: {
  dataURL: string;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataURL} alt="QR WhatsApp" className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs text-gray-500">
          Esperando que escanees el QR…
        </p>
        <p className="text-xs text-gray-400">
          El QR se actualiza automáticamente cada 5 segundos.
        </p>
      </div>

      <button
        onClick={onRefresh}
        className="text-xs text-[#25D366] hover:underline font-medium"
      >
        Forzar regeneración
      </button>
    </div>
  );
}

// ─── Estado: generando / spinner ─────────────────────────────────────────────

function WhatsAppSpinner({ label }: { label: string }) {
  return (
    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-3">
      <svg className="animate-spin text-[#25D366]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M21 12a9 9 0 1 1-9-9" />
      </svg>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export function WhatsAppModalContent() {
  const { showToast }  = useToastStore();
  const { hideModal }  = useModalStore();
  const queryClient    = useQueryClient();
  const createMutation = useCreateWhatsAppInstance();
  const deleteMutation = useDeleteWhatsAppInstance();
  const calledRef      = useRef(false);

  // Leer estado actual de WhatsApp desde activeCompany en el store
  const activeCompany    = useAuthStore((s) => s.activeCompany);
  const alreadyConnected = activeCompany?.whatsapp.connected ?? false;

  // Estado local para el QR — se setea una sola vez cuando llega el POST
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);

  // Polling SOLO cuando ya tenemos QR en pantalla (y no está ya conectado)
  const { data: status } = useWhatsAppStatus({ enabled: Boolean(qrDataURL) });

  // Crear instancia al montar — solo si NO está ya conectado
  useEffect(() => {
    if (alreadyConnected) return;
    if (calledRef.current) return;
    calledRef.current = true;
    createMutation.mutateAsync()
      .then((res) => { setQrDataURL(res.dataURL); })
      .catch((err) => {
        const msg = err instanceof ApiError ? err.message : "No se pudo crear la instancia.";
        showToast({ message: "Error al conectar WhatsApp", subMessage: msg, iconType: "error" });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyConnected]);

  // Cuando el polling confirma connected=true: actualiza /me, toast y cierra modal
  useEffect(() => {
    if (!status?.connected) return;
    queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    showToast({
      message: "WhatsApp conectado",
      subMessage: status.phone ? `Número: ${status.phone}` : "Vinculado correctamente.",
      iconType: "success",
    });
    hideModal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.connected]);

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync();
      showToast({ message: "WhatsApp desconectado", subMessage: "La instancia fue eliminada.", iconType: "success" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "No se pudo desconectar.";
      showToast({ message: "Error al desconectar", subMessage: msg, iconType: "error" });
    }
  }

  // ── Conectado (ya estaba conectado o detectado por polling) ──
  if (alreadyConnected || status?.connected) {
    const phone = status?.phone ?? (activeCompany?.whatsapp.phone ?? null);
    return (
      <WhatsAppConnected
        phone={phone}
        onDisconnect={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    );
  }

  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      {/* Pasos */}
      <ol className="flex flex-col gap-2">
        {[
          "Abre WhatsApp en tu celular",
          'Ve a Configuración → Dispositivos vinculados',
          'Toca "Vincular un dispositivo"',
          "Escanea el código QR que aparece abajo",
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
            <span className="w-5 h-5 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {/* Área QR */}
      <div className="flex flex-col items-center gap-4 py-2">

        {/* Sin QR todavía → spinner */}
        {!qrDataURL && (
          <WhatsAppSpinner label="Creando instancia…" />
        )}

        {/* QR disponible */}
        {qrDataURL && (
          <WhatsAppQr
            dataURL={qrDataURL}
            onRefresh={() => {
              setQrDataURL(null);
              createMutation.mutateAsync()
                .then((res) => setQrDataURL(res.dataURL))
                .catch(() => {});
            }}
          />
        )}

        {/* Disconnected — ofrecer reconectar */}
        {status?.status === "disconnected" && !qrDataURL && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-red-500 font-medium">Sesión desconectada</p>
            </div>
            <button
              onClick={() => createMutation.mutate()}
              className="rounded-lg bg-[#25D366] hover:bg-[#20ba5a] transition-colors text-white text-sm font-semibold px-6 py-2.5"
            >
              Reconectar WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
