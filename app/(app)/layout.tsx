import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ModalRenderer } from "@/components/ui/ModalRenderer";
import { CobranzaFAB } from "@/components/ui/CobranzaFAB";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />

      {/* Contenedor derecho flotante */}
      <div
        className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm"
        style={{ border: "1px solid #e5e7eb", margin: "8px 8px 8px 4px" }}
      >
        {/* Topbar */}
        <header
          className="h-14 flex items-center justify-between px-6 shrink-0"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-semibold text-brand tracking-wide uppercase">
              Agente de Cobranza
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <ModalRenderer />
      <CobranzaFAB />
    </div>
  );
}
