import type { ReactNode } from "react";

interface IntegrationCardProps {
  logo: ReactNode;
  nombre: string;
  descripcion: string;
  actionLabel: string;
  connected: boolean;
  onAction: () => void;
}

export function IntegrationCard({
  logo,
  nombre,
  descripcion,
  actionLabel,
  connected,
  onAction,
}: IntegrationCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white flex flex-col overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200">
      {/* Body */}
      <div className="flex-1 p-6">
        {/* Logo + estado */}
        <div className="flex items-center justify-between mb-5">
          {logo}
          <div className="flex items-center gap-1.5">
            <span
              className={[
                "w-2 h-2 rounded-full",
                connected ? "bg-green-500" : "bg-gray-300",
              ].join(" ")}
            />
            <span
              className={[
                "text-xs font-medium",
                connected ? "text-green-700" : "text-gray-400",
              ].join(" ")}
            >
              {connected ? "Conectado" : "Sin conectar"}
            </span>
          </div>
        </div>

        {/* Texto */}
        <p className="font-semibold text-gray-900 text-sm mb-1.5">{nombre}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{descripcion}</p>
      </div>

      {/* CTA — separado visualmente, ancho completo */}
      <div className="px-6 pb-6">
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
      </div>
    </div>
  );
}
