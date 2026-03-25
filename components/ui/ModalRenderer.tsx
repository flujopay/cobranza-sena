"use client";

import { useModalStore } from "@/store/modalStore";
import { useEffect } from "react";

export function ModalRenderer() {
  const { modals, hideModal } = useModalStore();

  useEffect(() => {
    document.body.style.overflow = modals.length > 0 ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modals.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modals.length > 0) hideModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modals, hideModal]);

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal, idx) => {
        const isTop     = idx === modals.length - 1;
        const slideFrom = modal.slideFrom ?? "bottom";
        const isPanel   = slideFrom === "right" || slideFrom === "left";

        const slideClass: Record<string, string> = {
          bottom: "animate-slide-up",
          top:    "animate-slide-down",
          right:  "animate-slide-left",
          left:   "animate-slide-right",
        };

        return (
          <div
            key={modal.modalId ?? idx}
            className={[
              "fixed inset-0 z-50",
              isPanel ? "flex items-stretch justify-end" : "flex items-end sm:items-center justify-center",
            ].join(" ")}
            style={{ zIndex: 50 + idx }}
          >
            {/* Backdrop */}
            {isTop && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={() => modal.closeOnOutsideClick !== false && hideModal()}
              />
            )}

            {/* Panel */}
            <div
              className={[
                "relative z-10 bg-white shadow-2xl flex flex-col",
                isPanel
                  ? "h-full rounded-l-2xl"
                  : "w-full rounded-t-2xl sm:rounded-2xl max-h-[92vh]",
                "overflow-hidden",
                slideClass[slideFrom] ?? "animate-slide-up",
                modal.modalClassName ?? "",
              ].join(" ")}
              style={{
                width: modal.width ?? (isPanel ? "480px" : undefined),
                maxWidth: isPanel ? undefined : (modal.width ?? "480px"),
              }}
            >
              {/* Header */}
              {modal.showHeader !== false && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                  <span className="font-semibold text-gray-900 text-base">
                    {modal.title ?? ""}
                  </span>
                  {modal.showCloseButton !== false && (
                    <button
                      onClick={hideModal}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      aria-label="Cerrar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Indicador de paso — solo si el contenido lo inyecta vía data-step */}
              <div className={["flex-1 overflow-y-auto", modal.contentClassName ?? ""].join(" ")}>
                {modal.content}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
