"use client";

import { useModalStore } from "@/store/modalStore";
import { IntegrationCard } from "@/components/integraciones/IntegrationCard";
import { SiiModalContent } from "@/components/integraciones/modals/SiiModalContent";
import { WhatsAppModalContent } from "@/components/integraciones/modals/WhatsAppModalContent";
import { SiiLogo } from "@/components/integraciones/logos/SiiLogo";
import { WhatsAppLogo } from "@/components/integraciones/logos/WhatsAppLogo";

export function IntegracionesGrid() {
  const { showModal } = useModalStore();

  const integraciones = [
    {
      id: "sii",
      logo: <SiiLogo />,
      nombre: "SII",
      descripcion: "Automatiza tus reportes y documentos cumpliendo las normativas chilenas.",
      actionLabel: "Sincronizar",
      connected: false,
      onAction: () =>
        showModal({
          title: "Configurar SII",
          content: <SiiModalContent />,
          closeOnOutsideClick: true,
          width: "520px",
          modalId: "sii",
        }),
    },
    {
      id: "whatsapp",
      logo: <WhatsAppLogo />,
      nombre: "WhatsApp (con QR)",
      descripcion: "Conecta tu WhatsApp o WhatsApp Business App mediante QR para chatear 1 a 1 con tus clientes.",
      actionLabel: "Sincronizar ahora",
      connected: false,
      onAction: () =>
        showModal({
          title: "Conectar WhatsApp",
          content: <WhatsAppModalContent />,
          closeOnOutsideClick: true,
          width: "420px",
          modalId: "whatsapp",
        }),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {integraciones.map((item) => (
        <IntegrationCard key={item.id} {...item} />
      ))}
    </div>
  );
}
