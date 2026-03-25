"use client";

import { useState, useRef } from "react";
import { useModalStore } from "@/store/modalStore";
import type { Canal, NivelRiesgo } from "@/lib/mock/plantillas";

/* ── Tipos ── */
type Step = 1 | 2 | 3;

const CANALES: { value: Canal; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: "email",
    label: "Email",
    desc: "Correo detallado con asunto",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    value: "sms",
    label: "SMS",
    desc: "Mensaje corto · máx. 160 car.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    desc: "Admite *negrita* y emojis",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
];

const NIVELES: { value: NivelRiesgo; label: string; emoji: string; hint: string; color: string; bg: string }[] = [
  { value: "verde",    label: "Recordatorio",  emoji: "🟢", hint: "Factura por vencer o recién vencida",      color: "#059669", bg: "#ecfdf5" },
  { value: "amarillo", label: "Por Vencer",    emoji: "🟡", hint: "Vence en menos de 7 días",                 color: "#b45309", bg: "#fffbeb" },
  { value: "naranja",  label: "En Mora",       emoji: "🟠", hint: "Vencida entre 8 y 30 días",               color: "#c2410c", bg: "#fff7ed" },
  { value: "rojo",     label: "Crítico",       emoji: "🔴", hint: "Más de 30 días sin pago — gestión legal", color: "#b91c1c", bg: "#fef2f2" },
];

const VARIABLES: { key: string; desc: string }[] = [
  { key: "{{nombre}}",           desc: "Nombre del deudor" },
  { key: "{{empresa_emisora}}", desc: "Tu empresa" },
  { key: "{{folio}}",           desc: "N° de factura" },
  { key: "{{monto}}",           desc: "Monto en pesos" },
  { key: "{{fecha_vencimiento}}", desc: "Fecha de vencimiento" },
  { key: "{{dias_vencida}}",    desc: "Días sin pago" },
  { key: "{{telefono_contacto}}", desc: "Teléfono de contacto" },
  { key: "{{email_contacto}}",  desc: "Email de contacto" },
];

/* ── Helpers ── */
function renderPreview(text: string, canal: Canal) {
  // Simula reemplazo de variables con valores de ejemplo
  const ejemplos: Record<string, string> = {
    "{{nombre}}": "María González",
    "{{empresa_emisora}}": "Aom Suministros",
    "{{folio}}": "3847",
    "{{monto}}": "1.240.000",
    "{{fecha_vencimiento}}": "15/04/2026",
    "{{dias_vencida}}": "12",
    "{{telefono_contacto}}": "+56 9 8765 4321",
    "{{email_contacto}}": "cobranza@aom.cl",
  };
  let result = text;
  Object.entries(ejemplos).forEach(([k, v]) => { result = result.replaceAll(k, v); });
  if (canal === "whatsapp") {
    result = result.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
  }
  return result;
}

/* ── Componente principal ── */
export function NuevaPlantillaModal() {
  const { hideModal } = useModalStore();
  const [step,   setStep]   = useState<Step>(1);
  const [canal,  setCanal]  = useState<Canal | null>(null);
  const [nivel,  setNivel]  = useState<NivelRiesgo | null>(null);
  const [nombre, setNombre] = useState("");
  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertarVariable(key: string) {
    const el = textareaRef.current;
    if (!el) { setCuerpo(p => p + key); return; }
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const next  = cuerpo.slice(0, start) + key + cuerpo.slice(end);
    setCuerpo(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + key.length, start + key.length);
    }, 0);
  }

  const canStep2 = canal !== null && nivel !== null;
  const canStep3 = nombre.trim() !== "" && cuerpo.trim() !== "";

  /* ── Barra de pasos ── */
  const StepBar = () => (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
      {([1, 2, 3] as Step[]).map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={[
            "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors",
            step === s ? "bg-brand text-white" : step > s ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400",
          ].join(" ")}>
            {step > s
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              : s}
          </div>
          <span className={`text-[11px] font-medium ${step === s ? "text-gray-700" : "text-gray-400"}`}>
            {s === 1 ? "Canal y nivel" : s === 2 ? "Redacción" : "Confirmar"}
          </span>
          {i < 2 && <div className="w-6 h-px bg-gray-200 mx-1" />}
        </div>
      ))}
    </div>
  );

  /* ── Paso 1: Canal + nivel ── */
  if (step === 1) return (
    <>
    <StepBar />
    <div className="flex flex-col gap-6 px-6 py-5">
      <p className="text-sm text-gray-500">Elige el canal y el momento en que se enviará este mensaje.</p>

      {/* Canal */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Canal de envío</label>
        <div className="flex flex-col gap-2">
          {CANALES.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCanal(c.value)}
              className={[
                "flex items-center gap-4 px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer",
                canal === c.value
                  ? "border-brand bg-brand-light"
                  : "border-gray-100 hover:border-gray-200 bg-white",
              ].join(" ")}
            >
              <span className={canal === c.value ? "text-brand" : "text-gray-400"}>{c.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${canal === c.value ? "text-brand" : "text-gray-700"}`}>{c.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
              </div>
              {canal === c.value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Nivel de riesgo del deudor</label>
        <div className="grid grid-cols-2 gap-2">
          {NIVELES.map(n => (
            <button
              key={n.value}
              type="button"
              onClick={() => setNivel(n.value)}
              className={[
                "flex flex-col gap-1 px-3 py-3 rounded-xl border-2 text-left transition-all cursor-pointer",
                nivel === n.value ? "border-current" : "border-gray-100 hover:border-gray-200",
              ].join(" ")}
              style={nivel === n.value ? { borderColor: n.color, background: n.bg } : {}}
            >
              <span className="text-base">{n.emoji} <span className="text-sm font-semibold" style={{ color: nivel === n.value ? n.color : "#374151" }}>{n.label}</span></span>
              <span className="text-[11px] text-gray-400 leading-tight">{n.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={hideModal}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
          Cancelar
        </button>
        <button type="button" onClick={() => setStep(2)} disabled={!canStep2}
          className="flex-1 rounded-xl bg-brand text-white py-2.5 text-sm font-semibold hover:bg-brand-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          Continuar
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
    </>
  );

  /* ── Paso 2: Redacción ── */
  if (step === 2) {
    const canalInfo = CANALES.find(c => c.value === canal)!;
    const nivelInfo = NIVELES.find(n => n.value === nivel)!;
    const isSms     = canal === "sms";
    const isEmail   = canal === "email";

    return (
      <>
      <StepBar />
      <div className="flex flex-col gap-4 px-6 py-5">
        {/* Resumen de selección */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            <span className="text-gray-400">{canalInfo.icon && <span style={{ display: "inline-flex", width: 12, height: 12 }}>{canalInfo.icon}</span>}</span>
            {canalInfo.label}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: nivelInfo.bg, color: nivelInfo.color }}>
            {nivelInfo.emoji} {nivelInfo.label}
          </span>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre de la plantilla</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder={`Ej: ${nivelInfo.label} por ${canalInfo.label}`}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
        </div>

        {/* Asunto (solo email) */}
        {isEmail && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Asunto del correo</label>
            <input
              type="text"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              placeholder="Ej: Factura N°{{folio}} — Acción requerida"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            />
          </div>
        )}

        {/* Variables */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Variables disponibles <span className="font-normal text-gray-400">· clic para insertar en el cursor</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map(v => (
              <button
                key={v.key}
                type="button"
                onClick={() => insertarVariable(v.key)}
                title={v.desc}
                className="text-[11px] bg-brand-light text-brand px-2 py-1 rounded-lg font-mono border border-brand/10 hover:bg-brand hover:text-white transition-colors cursor-pointer"
              >
                {v.key}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-500">Mensaje</label>
            <div className="flex items-center gap-3">
              {isSms && (
                <span className={`text-[11px] font-medium ${cuerpo.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                  {cuerpo.length}/160
                </span>
              )}
              <button
                type="button"
                onClick={() => setPreview(p => !p)}
                className="text-[11px] text-brand font-medium hover:text-brand-hover cursor-pointer flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                {preview ? "Editar" : "Vista previa"}
              </button>
            </div>
          </div>

          {preview ? (
            /* Vista previa */
            <div className={[
              "min-h-[160px] rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap",
              canal === "whatsapp" ? "bg-[#e9f5dc] border-[#d0e8b0] font-[system-ui]" : "bg-gray-50 border-gray-200",
            ].join(" ")}>
              {canal === "whatsapp"
                ? <div dangerouslySetInnerHTML={{ __html: renderPreview(cuerpo, canal) }} />
                : <span className="text-gray-700">{renderPreview(cuerpo, canal)}</span>
              }
              <p className="mt-3 pt-3 border-t border-current/10 text-[11px] text-gray-400 italic">
                Vista previa con datos de ejemplo — las variables se reemplazarán con los datos reales del deudor.
              </p>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={cuerpo}
              onChange={e => setCuerpo(e.target.value)}
              rows={isSms ? 4 : 7}
              placeholder={
                canal === "whatsapp"
                  ? "Hola {{nombre}} 👋\n\nTienes una factura pendiente de *${{monto}}*…"
                  : canal === "sms"
                  ? "{{empresa_emisora}}: Factura de ${{monto}} vence el {{fecha_vencimiento}}…"
                  : "Estimado/a {{nombre}},\n\nLe informamos que…"
              }
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none font-mono leading-relaxed"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={() => setStep(1)}
            className="px-4 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
            Atrás
          </button>
          <button type="button" onClick={() => setStep(3)} disabled={!canStep3}
            className="flex-1 rounded-xl bg-brand text-white py-2.5 text-sm font-semibold hover:bg-brand-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            Revisar y guardar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      </>
    );
  }

  /* ── Paso 3: Confirmación ── */
  const canalInfo = CANALES.find(c => c.value === canal)!;
  const nivelInfo = NIVELES.find(n => n.value === nivel)!;

  return (
    <>
    <StepBar />
    <div className="flex flex-col gap-5 px-6 py-5">
      <p className="text-sm text-gray-500">Revisa tu plantilla antes de guardarla.</p>

      {/* Resumen */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 divide-y divide-gray-100 overflow-hidden">
        <Row label="Canal">{canalInfo.label}</Row>
        <Row label="Nivel">{nivelInfo.emoji} {nivelInfo.label}</Row>
        <Row label="Nombre">{nombre}</Row>
        {asunto && <Row label="Asunto">{asunto}</Row>}
      </div>

      {/* Preview del cuerpo */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Mensaje</p>
        <div className={[
          "rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto",
          canal === "whatsapp" ? "bg-[#e9f5dc] border-[#d0e8b0]" : "bg-gray-50 border-gray-200 font-mono text-gray-700",
        ].join(" ")}>
          {canal === "whatsapp"
            ? <div dangerouslySetInnerHTML={{ __html: renderPreview(cuerpo, canal!) }} />
            : renderPreview(cuerpo, canal!)
          }
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5 italic">Vista previa con datos de ejemplo.</p>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={() => setStep(2)}
          className="px-4 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
          Editar
        </button>
        <button
          type="button"
          onClick={hideModal}
          className="flex-1 rounded-xl bg-brand text-white py-2.5 text-sm font-semibold hover:bg-brand-hover transition-colors cursor-pointer shadow-sm shadow-brand/20 flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Guardar plantilla
        </button>
      </div>
    </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-700 font-medium">{children}</span>
    </div>
  );
}
