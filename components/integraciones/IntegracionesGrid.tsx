"use client";

import { useModalStore } from "@/store/modalStore";
import { useToastStore } from "@/store/toastStore";
import { IntegrationCard } from "@/components/integraciones/IntegrationCard";
import { SiiModalContent } from "@/components/integraciones/modals/SiiModalContent";
import { WhatsAppModalContent } from "@/components/integraciones/modals/WhatsAppModalContent";
import { SiiLogo } from "@/components/integraciones/logos/SiiLogo";
import { WhatsAppLogo } from "@/components/integraciones/logos/WhatsAppLogo";
import { useDeleteSiiCreds } from "@/lib/hooks/useSii";
import { useDeleteWhatsAppInstance } from "@/lib/hooks/useWhatsApp";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api/client";

export function IntegracionesGrid() {
  const { showModal }              = useModalStore();
  const { showToast }              = useToastStore();
  const activeCompany              = useAuthStore((s) => s.activeCompany);
  const deleteSii                  = useDeleteSiiCreds();
  const deleteWa                   = useDeleteWhatsAppInstance();

  // Ambos estados vienen de /me vía activeCompany — sin llamadas extra
  const siiConnected      = activeCompany?.has_sii_credentials ?? false;
  const whatsappConnected = activeCompany?.whatsapp.connected ?? false;
  const siiDetail         = activeCompany?.ruc ?? undefined;
  const waDetail          = activeCompany?.whatsapp.phone ?? undefined;

  async function handleDisconnectSii() {
    try {
      await deleteSii.mutateAsync();
      showToast({ message: "SII desconectado", subMessage: "Las credenciales fueron eliminadas.", iconType: "success" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "No se pudo desconectar el SII.";
      showToast({ message: "Error al desconectar", subMessage: msg, iconType: "error" });
    }
  }

  async function handleDisconnectWhatsApp() {
    try {
      await deleteWa.mutateAsync();
      showToast({ message: "WhatsApp desconectado", subMessage: "La instancia fue eliminada.", iconType: "success" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "No se pudo desconectar WhatsApp.";
      showToast({ message: "Error al desconectar", subMessage: msg, iconType: "error" });
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <IntegrationCard
        logo={<SiiLogo />}
        nombre="SII"
        descripcion="Automatiza tus reportes y documentos cumpliendo las normativas chilenas."
        actionLabel="Sincronizar"
        connected={siiConnected}
        connectedDetail={siiDetail}
        onAction={() => showModal({ title: "Configurar SII", content: <SiiModalContent />, closeOnOutsideClick: true, width: "520px", modalId: "sii" })}
        onDisconnect={handleDisconnectSii}
        isDisconnecting={deleteSii.isPending}
      />
      <IntegrationCard
        logo={<WhatsAppLogo />}
        nombre="WhatsApp"
        descripcion="Conecta tu WhatsApp personal mediante QR para chatear 1 a 1 con tus clientes."
        actionLabel="Conectar ahora"
        connected={whatsappConnected}
        connectedDetail={waDetail}
        onAction={() => showModal({ title: "Conectar WhatsApp", content: <WhatsAppModalContent />, closeOnOutsideClick: false, width: "420px", modalId: "whatsapp" })}
        onDisconnect={whatsappConnected ? handleDisconnectWhatsApp : undefined}
        isDisconnecting={deleteWa.isPending}
      />
    </div>
  );
}
