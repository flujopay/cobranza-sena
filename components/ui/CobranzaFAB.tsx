"use client";

import { useModalStore } from "@/store/modalStore";

function IniciarCobranzaModal() {
  const { hideModal } = useModalStore();
  return (
    <div className="px-6 py-6 flex flex-col gap-4">
      <p className="text-sm text-gray-500 leading-relaxed">
        El agente analizará tus facturas vencidas, calculará el score de riesgo de cada
        deudor y comenzará a enviar mensajes personalizados por el canal adecuado.
      </p>
      <div className="rounded-xl border border-brand/20 bg-brand-light px-4 py-3 flex gap-3 items-start">
        <svg className="shrink-0 text-brand mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-brand leading-relaxed">
          Asegúrate de tener el SII y WhatsApp integrados antes de iniciar.
        </p>
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={hideModal}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          Cancelar
        </button>
        <button onClick={hideModal}
          className="flex-1 rounded-xl bg-brand hover:bg-brand-hover active:bg-brand-active py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer shadow-md shadow-brand/30">
          Confirmar y ejecutar
        </button>
      </div>
    </div>
  );
}

export function CobranzaFAB() {
  const { showModal } = useModalStore();

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Glow difuso */}
      <div className="absolute inset-0 rounded-2xl bg-brand blur-xl opacity-40 scale-110 animate-pulse pointer-events-none" />
      {/* Anillo pulsante */}
      <span className="absolute -inset-2 rounded-[24px] border border-brand/25 animate-pulse pointer-events-none" />

      <button
        onClick={() => showModal({
          title: "Iniciar Cobranza",
          content: <IniciarCobranzaModal />,
          closeOnOutsideClick: true,
          width: "440px",
          modalId: "iniciar-cobranza",
        })}
        className={[
          "relative flex items-center gap-2.5 pl-4 pr-5 h-12 rounded-2xl cursor-pointer",
          "bg-gradient-to-r from-[#3771D1] to-[#2d5eb8]",
          "shadow-xl shadow-brand/40",
          "hover:scale-105 hover:shadow-2xl hover:shadow-brand/50",
          "active:scale-100",
          "transition-all duration-200",
        ].join(" ")}
        aria-label="Iniciar Cobranza"
      >
        {/* Líneas de scan */}
        <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-15">
          <span className="absolute inset-x-0 top-1/3 h-px bg-white" />
          <span className="absolute inset-x-0 top-2/3 h-px bg-white" />
        </span>

        {/* Ícono rayo */}
        <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-lg bg-white/20">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>

        {/* Label */}
        <span className="relative z-10 text-white text-sm font-semibold tracking-wide whitespace-nowrap">
          Iniciar Cobranza
        </span>
      </button>
    </div>
  );
}
