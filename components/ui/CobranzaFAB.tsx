"use client";

import { useModalStore } from "@/store/modalStore";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { useRef, useState, useEffect, useCallback } from "react";
import { iniciarCobranza } from "@/lib/api/cobranza";

function IniciarCobranzaModal() {
  const { hideModal } = useModalStore();
  const accessToken = useAuthStore((s) => s.accessToken);
  const companyId = useAuthStore((s) => s.companyId);
  const showToast = useToastStore((s) => s.showToast);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!accessToken || !companyId) {
      showToast({ message: "Sesión no válida", subMessage: "Inicia sesión nuevamente.", iconType: "error" });
      hideModal();
      return;
    }

    setLoading(true);
    try {
      const result = await iniciarCobranza(accessToken, companyId);

      if (result.status === "ok") {
        showToast({
          message: "Cobranza iniciada",
          subMessage: `${result.debtors_processed} deudores procesados, ${result.messages_sent} mensajes enviados.`,
          iconType: "success",
        });
      } else {
        showToast({ message: "Error al iniciar cobranza", subMessage: result.message, iconType: "error" });
      }
    } catch (err) {
      showToast({
        message: "Error de conexión",
        subMessage: err instanceof Error ? err.message : "No se pudo conectar con el servicio.",
        iconType: "error",
      });
    } finally {
      setLoading(false);
      hideModal();
    }
  }

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
        <button onClick={hideModal} disabled={loading}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50">
          Cancelar
        </button>
        <button onClick={handleConfirm} disabled={loading}
          className="flex-1 rounded-xl bg-brand hover:bg-brand-hover active:bg-brand-active py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer shadow-md shadow-brand/30 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Ejecutando…
            </>
          ) : (
            "Confirmar y ejecutar"
          )}
        </button>
      </div>
    </div>
  );
}

const STORAGE_KEY = "cobranza-fab-pos";
const DEFAULT_POS = { x: -8, y: -32 }; // right/bottom offset from corner

export function CobranzaFAB() {
  const { showModal } = useModalStore();

  // Posición en px desde top-left de la ventana
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging   = useRef(false);
  const moved      = useRef(false);
  const offset     = useRef({ x: 0, y: 0 });
  const btnRef     = useRef<HTMLDivElement>(null);

  // Inicializar posición desde localStorage o default
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setPos(clamp(p.x, p.y));
        return;
      } catch {}
    }
    setPos(clamp(
      window.innerWidth  + DEFAULT_POS.x - 180,
      window.innerHeight + DEFAULT_POS.y - 48,
    ));
  }, []);

  function clamp(x: number, y: number) {
    const w = btnRef.current?.offsetWidth  ?? 180;
    const h = btnRef.current?.offsetHeight ?? 48;
    return {
      x: Math.max(8, Math.min(x, window.innerWidth  - w - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - h - 8)),
    };
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current) return;
    dragging.current = true;
    moved.current    = false;
    const rect = btnRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!btnRef.current) return;
    dragging.current = true;
    moved.current    = false;
    const rect  = btnRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    offset.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      moved.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const next = clamp(clientX - offset.current.x, clientY - offset.current.y);
      setPos(next);
    }

    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      setPos(prev => {
        if (prev) localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
        return prev;
      });
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
  }, []);

  function handleClick() {
    if (moved.current) return; // fue un drag, no un click
    showModal({
      title: "Iniciar Cobranza",
      content: <IniciarCobranzaModal />,
      closeOnOutsideClick: true,
      width: "440px",
      modalId: "iniciar-cobranza",
    });
  }

  if (!pos) return null;

  return (
    <div
      ref={btnRef}
      className="fixed z-40 select-none"
      style={{ left: pos.x, top: pos.y, touchAction: "none" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-brand blur-xl opacity-40 scale-110 animate-pulse pointer-events-none" />
      <span className="absolute -inset-2 rounded-[24px] border border-brand/25 animate-pulse pointer-events-none" />

      <button
        onClick={handleClick}
        className={[
          "relative flex items-center gap-2.5 pl-4 pr-5 h-12 rounded-2xl cursor-grab active:cursor-grabbing",
          "bg-gradient-to-r from-[#3771D1] to-[#2d5eb8]",
          "shadow-xl shadow-brand/40",
          "hover:shadow-2xl hover:shadow-brand/50",
          "transition-shadow duration-200",
        ].join(" ")}
        aria-label="Iniciar Cobranza"
        draggable={false}
      >
        <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-15">
          <span className="absolute inset-x-0 top-1/3 h-px bg-white" />
          <span className="absolute inset-x-0 top-2/3 h-px bg-white" />
        </span>

        <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-lg bg-white/20">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>

        <span className="relative z-10 text-white text-sm font-semibold tracking-wide whitespace-nowrap">
          Iniciar Cobranza
        </span>
      </button>
    </div>
  );
}
