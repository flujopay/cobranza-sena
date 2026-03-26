"use client";

import type { ReactNode } from "react";

interface IntegrationCardProps {
  logo: ReactNode;
  nombre: string;
  descripcion: string;
  actionLabel: string;
  connected: boolean;
  connectedDetail?: string;
  hideActionWhenConnected?: boolean;
  onAction: () => void;
  onDisconnect?: () => void;
  isDisconnecting?: boolean;
}

export function IntegrationCard({
  logo,
  nombre,
  descripcion,
  actionLabel,
  connected,
  connectedDetail,
  hideActionWhenConnected,
  onAction,
  onDisconnect,
  isDisconnecting,
}: IntegrationCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white flex flex-col overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200">
      {/* Body */}
      <div className="flex-1 p-6">
        {/* Logo + estado */}
        <div className="flex items-center justify-between mb-5">
          {logo}
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className={["w-2 h-2 rounded-full", connected ? "bg-green-500" : "bg-gray-300"].join(" ")} />
              <span className={["text-xs font-medium", connected ? "text-green-700" : "text-gray-400"].join(" ")}>
                {connected ? "Conectado" : "Sin conectar"}
              </span>
            </div>
            {connected && connectedDetail && (
              <span className="text-[10px] text-gray-400 font-mono">{connectedDetail}</span>
            )}
          </div>
        </div>

        <p className="font-semibold text-gray-900 text-sm mb-1.5">{nombre}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{descripcion}</p>
      </div>

      {/* Acciones */}
      <div className="px-6 pb-6 flex flex-col gap-2">
        {(!connected || !hideActionWhenConnected) && (
          <button
            onClick={onAction}
            className={[
              "w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 cursor-pointer",
              connected
                ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                : "bg-brand hover:bg-brand-hover active:scale-[0.98] text-white shadow-sm shadow-brand/20",
            ].join(" ")}
          >
            {connected ? "Administrar" : actionLabel}
          </button>
        )}

        {/* Desconectar — solo visible cuando conectado */}
        {connected && onDisconnect && (
          <button
            onClick={onDisconnect}
            disabled={isDisconnecting}
            className="w-full rounded-xl py-2 text-xs font-medium text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            {isDisconnecting ? "Desconectando…" : "Desconectar"}
          </button>
        )}
      </div>
    </div>
  );
}
