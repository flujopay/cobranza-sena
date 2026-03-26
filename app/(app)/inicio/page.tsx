import Link from "next/link";

const SECTIONS = [
  {
    label: "Clientes",
    desc: "Gestiona y visualiza la información de tus clientes deudores.",
    href: "/clientes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Documentos",
    desc: "Accede a tus facturas y documentos tributarios importados desde el SII.",
    href: "/documentos",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    label: "Contactos",
    desc: "Administra los datos de contacto de tus deudores.",
    href: "/contactos",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Pagos",
    desc: "Revisa el historial de pagos y el estado de cobros en curso.",
    href: "/pagos",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M7 15h2" />
      </svg>
    ),
  },
  {
    label: "Plantillas",
    desc: "Configura los mensajes personalizados que el agente usa por canal y nivel de riesgo.",
    href: "/plantillas",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" />
        <line x1="7" y1="11" x2="17" y2="6" /><line x1="7" y1="13" x2="17" y2="18" />
      </svg>
    ),
  },
  {
    label: "Integraciones",
    desc: "Conecta el SII y WhatsApp para automatizar la importación y el envío de mensajes.",
    href: "/integraciones",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" />
        <line x1="7" y1="6" x2="17" y2="6" /><line x1="6" y1="8" x2="11" y2="16" /><line x1="18" y1="8" x2="13" y2="16" />
      </svg>
    ),
  },
];

export default function InicioPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Inicio</h1>
        <p className="mt-1 text-sm text-gray-500">Bienvenido a Sena — elige una sección para comenzar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3 hover:border-brand/40 hover:shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-brand/8 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-200">
              {s.icon}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{s.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{s.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
              Ir a {s.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
