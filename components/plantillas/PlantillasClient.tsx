"use client";

import { useState } from "react";
import {
  PLANTILLAS_MOCK,
  PREVIEW_FACTURAS,
  PREVIEW_VARS,
  CANAL_LABELS,
  RIESGO_LABELS,
  RIESGO_COLORS,
  type Canal,
  type Plantilla,
} from "@/lib/mock/plantillas";
import { useModalStore } from "@/store/modalStore";
import { NuevaPlantillaModal } from "./NuevaPlantillaModal";

const CANALES: Canal[] = ["email", "sms", "whatsapp"];

const CANAL_ICONS: Record<Canal, React.ReactNode> = {
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  sms: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  whatsapp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  ),
};

// ─── Tabla de facturas de ejemplo ────────────────────────────────────────────

function FacturasListWhatsApp() {
  const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
  const total = PREVIEW_FACTURAS.reduce((s, f) => s + f.monto, 0);
  return (
    <div className="text-[12px] text-gray-800 flex flex-col gap-1.5">
      <div className="flex justify-between gap-3 text-[11px] font-semibold text-gray-500 border-b border-[#c8f0b0] pb-1 mb-0.5">
        <span>Folio</span>
        <span>Vencimiento</span>
        <span>Monto</span>
      </div>
      {PREVIEW_FACTURAS.map(f => (
        <div key={f.folio} className="flex justify-between gap-3">
          <span className="font-mono text-gray-600">{f.folio}</span>
          <span className="text-gray-500">{f.fecha_vencimiento}</span>
          <span className="font-semibold">{fmt(f.monto)}</span>
        </div>
      ))}
      <div className="border-t border-[#c8f0b0] mt-1 pt-1 flex justify-between font-bold">
        <span>Total</span>
        <span>{fmt(total)}</span>
      </div>
    </div>
  );
}

function FacturasTable() {
  const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
  const total = PREVIEW_FACTURAS.reduce((s, f) => s + f.monto, 0);
  return (
    <div className="mt-3 rounded-xl border border-gray-200 overflow-x-auto text-[11px]">
      <table className="w-full min-w-[300px]">
        <thead>
          <tr className="bg-gray-50 text-gray-500 font-semibold">
            <th className="text-left px-3 py-2">Folio</th>
            <th className="text-left px-3 py-2">Vencimiento</th>
            <th className="text-right px-3 py-2">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {PREVIEW_FACTURAS.map(f => (
            <tr key={f.folio} className="bg-white">
              <td className="px-3 py-2 font-mono text-gray-700">{f.folio}</td>
              <td className="px-3 py-2 text-gray-500">{f.fecha_vencimiento}</td>
              <td className="px-3 py-2 text-right font-semibold text-gray-800">{fmt(f.monto)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 border-t border-gray-200 font-bold text-gray-700">
            <td colSpan={2} className="px-3 py-2 text-right">Total</td>
            <td className="px-3 py-2 text-right">{fmt(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Preview del cuerpo con variables reemplazadas ───────────────────────────

function renderPreview(cuerpo: string): string {
  return Object.entries(PREVIEW_VARS).reduce(
    (text, [key, val]) => text.replaceAll(key, val),
    cuerpo
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function PlantillaCard({ plantilla }: { plantilla: Plantilla }) {
  const [expanded, setExpanded] = useState(false);
  const preview = renderPreview(plantilla.cuerpo);
  const asuntoPreview = plantilla.asunto ? renderPreview(plantilla.asunto) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${RIESGO_COLORS[plantilla.nivelRiesgo]}`}>
              {RIESGO_LABELS[plantilla.nivelRiesgo]}
            </span>
            {plantilla.activa ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Activa
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">Inactiva</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{plantilla.nombre}</h3>
          {asuntoPreview && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">Asunto: {asuntoPreview}</p>
          )}
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-xs text-brand font-medium hover:text-brand-hover transition-colors cursor-pointer shrink-0"
        >
          {expanded ? "Ocultar" : "Ver plantilla"}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t border-gray-100">
          {/* Cabecera de preview */}
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mt-3 mb-2">
            Vista previa con datos de ejemplo
          </p>

          {/* Burbuja de mensaje según canal */}
          {plantilla.canal === "whatsapp" ? (
            <div className="flex flex-col gap-1 max-w-xs">
              <div className="bg-[#e7ffd9] rounded-2xl rounded-tl-sm px-4 py-3 text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap shadow-sm">
                {preview.replace("{{facturas_detalle}}", "ver tabla abajo")}
              </div>
              <div className="bg-[#e7ffd9] rounded-2xl rounded-tl-sm px-3 py-3 shadow-sm">
                <FacturasListWhatsApp />
              </div>
              <div className="bg-[#e7ffd9] rounded-2xl rounded-tl-sm px-4 py-2 text-[12px] shadow-sm">
                <span className="text-gray-500 font-medium">Pagar: </span>
                <span className="text-blue-600 underline">https://somossena.com/pago/abc123</span>
              </div>
            </div>
          ) : plantilla.canal === "sms" ? (
            <div className="flex flex-col gap-1 max-w-xs">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap shadow-sm">
                {preview}
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 text-[12px] shadow-sm">
                <span className="text-gray-500 font-medium">Pagar: </span>
                <span className="text-blue-600 underline">https://somossena.com/pago/abc123</span>
              </div>
            </div>
          ) : (
            /* Email */
            <div className="rounded-xl border border-gray-200 overflow-hidden text-[12px]">
              {asuntoPreview && (
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2">
                  <span className="text-gray-400 font-medium shrink-0">Asunto:</span>
                  <span className="text-gray-700 font-semibold truncate">{asuntoPreview}</span>
                </div>
              )}
              <div className="px-4 py-3 text-gray-700 leading-relaxed whitespace-pre-wrap bg-white">
                {preview.replace("{{facturas_detalle}}", "ver tabla abajo")}
              </div>
              <FacturasTable />
              <div className="px-4 py-4 bg-white border-t border-gray-100">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-brand text-white text-[12px] font-semibold rounded-lg cursor-default"
                >
                  Ir al Portal de Pagos
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PlantillasClient() {
  const [canal, setCanal] = useState<Canal>("email");
  const { showModal } = useModalStore();

  function abrirNuevaPlantilla() {
    showModal({
      title: "Nueva plantilla",
      content: <NuevaPlantillaModal />,
      closeOnOutsideClick: true,
      width: "480px",
      slideFrom: "right",
      modalId: "nueva-plantilla",
    });
  }

  const plantillasFiltradas = PLANTILLAS_MOCK.filter(p => p.canal === canal);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Plantillas de Mensaje</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Mensajes predefinidos para contactar deudores según canal y nivel de riesgo.
        </p>
      </div>

      {/* Tabs de canal — scrollable en mobile */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {CANALES.map(c => (
            <button
              key={c}
              onClick={() => setCanal(c)}
              className={[
                "flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2 cursor-pointer whitespace-nowrap",
                canal === c
                  ? "text-brand border-brand"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300",
              ].join(" ")}
            >
              <span className={canal === c ? "text-brand" : "text-gray-400"}>{CANAL_ICONS[c]}</span>
              {CANAL_LABELS[c]}
              <span className={[
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                canal === c ? "bg-brand text-white" : "bg-gray-100 text-gray-500",
              ].join(" ")}>
                {PLANTILLAS_MOCK.filter(p => p.canal === c).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info banner */}
      {/*<div className="mb-5 rounded-xl bg-brand-light border border-brand/15 px-4 py-3 flex gap-3 items-start">
        <svg className="shrink-0 text-brand mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-brand leading-relaxed">
          Las variables entre <code className="font-mono bg-brand/10 px-1 rounded">{"{{llaves}}"}</code> se reemplazan automáticamente con los datos del deudor al enviar el mensaje.
        </p>
      </div>*/}

      {/* Cards por nivel de riesgo */}
      <div className="flex flex-col gap-4">
        {plantillasFiltradas.map(p => (
          <PlantillaCard key={p.id} plantilla={p} />
        ))}
      </div>
    </div>
  );
}
