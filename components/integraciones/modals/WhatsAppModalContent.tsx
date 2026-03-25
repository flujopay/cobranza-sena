"use client";

import { useState } from "react";

type QrStatus = "idle" | "generating" | "ready" | "connected";

export function WhatsAppModalContent() {
  const [status, setStatus] = useState<QrStatus>("idle");

  function handleGenerate() {
    setStatus("generating");
    // TODO: llamar a Evolution API para obtener QR real
    setTimeout(() => setStatus("ready"), 1800);
  }

  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      {/* Steps */}
      <ol className="flex flex-col gap-2">
        {[
          "Abre WhatsApp en tu celular",
          'Ve a Configuración → Dispositivos vinculados',
          "Toca \"Vincular un dispositivo\"",
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

      {/* QR area */}
      <div className="flex flex-col items-center gap-4 py-4">
        {status === "idle" && (
          <>
            <div className="w-44 h-44 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <svg className="text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="5" height="5" /><rect x="16" y="3" width="5" height="5" />
                <rect x="3" y="16" width="5" height="5" /><rect x="10" y="10" width="4" height="4" />
                <line x1="16" y1="10" x2="21" y2="10" /><line x1="16" y1="14" x2="16" y2="21" />
                <line x1="21" y1="14" x2="21" y2="21" />
              </svg>
            </div>
            <button
              onClick={handleGenerate}
              className="rounded-lg bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1aa04e] transition-colors text-white text-sm font-semibold px-6 py-2.5 cursor-pointer"
            >
              Generar código QR
            </button>
          </>
        )}

        {status === "generating" && (
          <div className="w-44 h-44 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-3">
            <svg className="animate-spin text-[#25D366]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-9-9" />
            </svg>
            <p className="text-xs text-gray-400">Generando QR…</p>
          </div>
        )}

        {status === "ready" && (
          <>
            {/* QR simulado con patrón SVG */}
            <div className="w-44 h-44 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Esquinas */}
                <rect x="5" y="5" width="30" height="30" rx="2" fill="none" stroke="#111" strokeWidth="4" />
                <rect x="12" y="12" width="16" height="16" rx="1" fill="#111" />
                <rect x="65" y="5" width="30" height="30" rx="2" fill="none" stroke="#111" strokeWidth="4" />
                <rect x="72" y="12" width="16" height="16" rx="1" fill="#111" />
                <rect x="5" y="65" width="30" height="30" rx="2" fill="none" stroke="#111" strokeWidth="4" />
                <rect x="12" y="72" width="16" height="16" rx="1" fill="#111" />
                {/* Datos simulados */}
                {[40,45,50,55,60,65,70,75,80,85,90].map((y) =>
                  [5,10,15,20,40,45,55,65,75,85,90].map((x) =>
                    Math.random() > 0.45 ? (
                      <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#111" />
                    ) : null
                  )
                )}
              </svg>
            </div>
            <p className="text-xs text-gray-400 text-center">
              El QR expira en <span className="font-semibold text-gray-600">60 seg</span>. Escanéalo pronto.
            </p>
            <button
              onClick={handleGenerate}
              className="text-xs text-[#25D366] hover:underline cursor-pointer"
            >
              Regenerar QR
            </button>
          </>
        )}

        {status === "connected" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="text-green-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900 text-sm">WhatsApp conectado</p>
            <p className="text-xs text-gray-500">Ya puedes enviar y recibir mensajes desde Mini Sena.</p>
          </div>
        )}
      </div>
    </div>
  );
}
