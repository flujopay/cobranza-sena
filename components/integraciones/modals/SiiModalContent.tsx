"use client";

import { SiiForm } from "@/components/sii/SiiForm";

export function SiiModalContent() {
  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      {/* Info banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex gap-3 items-start">
        <svg className="shrink-0 text-blue-500 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-blue-700 leading-relaxed">
          Tus credenciales se usan exclusivamente para consultar el SII y extraer
          facturas vencidas. Se almacenan encriptadas y puedes revocarlas en cualquier momento.
        </p>
      </div>

      <SiiForm />
    </div>
  );
}
