"use client";

import { useModalStore } from "@/store/modalStore";
import { useToastStore } from "@/store/toastStore";
import { IntegrationCard } from "@/components/integraciones/IntegrationCard";
import { SiiModalContent } from "@/components/integraciones/modals/SiiModalContent";
import { WhatsAppModalContent } from "@/components/integraciones/modals/WhatsAppModalContent";
import { SiiLogo } from "@/components/integraciones/logos/SiiLogo";
import { WhatsAppLogo } from "@/components/integraciones/logos/WhatsAppLogo";
import { useSiiStatus, useDeleteSiiCreds } from "@/lib/hooks/useSii";
import { useMe } from "@/lib/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api/client";

export function IntegracionesGrid() {
  const { showModal }              = useModalStore();
  const { showToast }              = useToastStore();
  const { data: siiStatus }        = useSiiStatus();
  const { data: me }               = useMe();
  const companyId                  = useAuthStore((s) => s.companyId);
  const deleteSii                  = useDeleteSiiCreds();

  const activeCompany    = me?.companies.find(c => c.id === companyId);
  const whatsappConnected = activeCompany?.whatsapp.connected ?? false;
  const siiConnected      = siiStatus?.has_credentials ?? false;

  async function handleDisconnectSii() {
    try {
      await deleteSii.mutateAsync();
      showToast({ message: "SII desconectado", subMessage: "Las credenciales fueron eliminadas.", iconType: "success" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "No se pudo desconectar el SII.";
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
        onAction={() => showModal({ title: "Configurar SII", content: <SiiModalContent />, closeOnOutsideClick: true, width: "520px", modalId: "sii" })}
        onDisconnect={handleDisconnectSii}
        isDisconnecting={deleteSii.isPending}
      />
      <IntegrationCard
        logo={<WhatsAppLogo />}
        nombre="WhatsApp (con QR)"
        descripcion="Conecta tu WhatsApp o WhatsApp Business App mediante QR para chatear 1 a 1 con tus clientes."
        actionLabel="Sincronizar ahora"
        connected={whatsappConnected}
        onAction={() => showModal({ title: "Conectar WhatsApp", content: <WhatsAppModalContent />, closeOnOutsideClick: true, width: "420px", modalId: "whatsapp" })}
      />
    </div>
  );
}
