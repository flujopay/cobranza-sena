"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useToastStore } from "@/store/toastStore";

// ─── Iconos por tipo ──────────────────────────────────────────────────────────

function IconSuccess() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function IconError() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  );
}

function IconWarning() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
  );
}

function IconInfo() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
  );
}

const ICONS = { success: IconSuccess, error: IconError, warning: IconWarning, info: IconInfo };

// ─── Componente Toast ─────────────────────────────────────────────────────────

export function Toast() {
  const { message, subMessage, iconType, action, trigger, resetToast } = useToastStore();

  useEffect(() => {
    if (!trigger) return;

    const Icon = ICONS[iconType ?? "success"];

    toast.custom(
      (t) => (
        <div
          role="alert"
          style={{
            minWidth: 300, maxWidth: 420,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            border: "1px solid #f1f1f4",
            display: "flex",
            alignItems: "center",
            padding: "12px 14px",
            gap: 12,
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          <Icon />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#252f4a", lineHeight: 1.3 }}>{message}</p>
            {subMessage && (
              <p style={{ fontSize: 12, color: "#78829d", marginTop: 2, lineHeight: 1.4 }}>{subMessage}</p>
            )}
            {action && (
              <button
                onClick={() => { action.onClick(); toast.dismiss(t.id); }}
                style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: "#3771D1", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {action.label} →
              </button>
            )}
          </div>

          {/* Cerrar */}
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: 4, cursor: "pointer", background: "none", border: "none", color: "#9ca3af", flexShrink: 0, borderRadius: 6, display: "flex" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ),
      { duration: 4000, position: "top-right" }
    );

    setTimeout(() => resetToast(), 100);
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  return <Toaster />;
}
