import Link from "next/link";

const PHASES = [
  {
    num: 1,
    label: "Integraciones",
    desc: "Conecta tu empresa al SII y WhatsApp para importar facturas y gestionar contactos.",
    href: "/integraciones",
    status: "pending" as const,
  },
  {
    num: 2,
    label: "Importación de Facturas",
    desc: "Extracción automática de facturas vencidas desde el SII.",
    href: "#",
    status: "locked" as const,
  },
  {
    num: 3,
    label: "Carga de Contactos",
    desc: "Sube los datos de contacto de tus deudores.",
    href: "#",
    status: "locked" as const,
  },
  {
    num: 4,
    label: "Motor de Score",
    desc: "Cálculo automático de riesgo 0-100 por deudor.",
    href: "#",
    status: "locked" as const,
  },
  {
    num: 5,
    label: "Generación de Mensajes",
    desc: "Mensajes personalizados por IA según nivel de riesgo.",
    href: "#",
    status: "locked" as const,
  },
  {
    num: 6,
    label: "Envío con Portal de Pago",
    desc: "Envío multicanal con link directo al portal de pago.",
    href: "#",
    status: "locked" as const,
  },
];

export default function InicioPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Inicio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configura tu plataforma de cobranza siguiendo las fases del flujo.
        </p>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Progreso de configuración</p>
          <p className="text-sm text-gray-400">0 / {PHASES.length} fases</p>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-2 bg-brand rounded-full" style={{ width: "0%" }} />
        </div>
      </div>

      {/* Phases grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PHASES.map((phase) => {
          const isLocked = phase.status === "locked";
          const Card = (
            <div
              className={[
                "rounded-xl border bg-white p-5 flex flex-col gap-3 transition-all duration-200",
                isLocked
                  ? "opacity-50 cursor-not-allowed border-gray-200"
                  : "hover:shadow-md cursor-pointer border-brand/30 hover:border-brand/60",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    isLocked ? "bg-gray-100 text-gray-400" : "bg-brand text-white",
                  ].join(" ")}
                >
                  {phase.num}
                </div>
                <p className="font-semibold text-sm text-gray-900">{phase.label}</p>
                {isLocked && (
                  <svg className="ml-auto text-gray-300 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{phase.desc}</p>
            </div>
          );

          return isLocked ? (
            <div key={phase.num}>{Card}</div>
          ) : (
            <Link key={phase.num} href={phase.href}>{Card}</Link>
          );
        })}
      </div>
    </div>
  );
}
