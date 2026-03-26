"use client";

import { useMe } from "@/lib/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { SiiModalContent } from "@/components/integraciones/modals/SiiModalContent";
import type { Company } from "@/lib/api/types/auth";

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ email, photo, size = 48 }: { email: string; photo?: string | null; size?: number }) {
  const initial = email[0]?.toUpperCase() ?? "?";
  if (photo) return <img src={photo} alt="" style={{ width: size, height: size }} className="rounded-full object-cover shrink-0" />;
  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, background: "linear-gradient(135deg, #3771D1 0%, #5b90e8 100%)", fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: ok ? "#16a34a" : "#6b7280" }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0 inline-block" style={{ background: ok ? "#22c55e" : "#d1d5db" }} />
      {label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Sk({ w = "100%", h = 14 }: { w?: string | number; h?: number }) {
  return <div className="rounded-md bg-gray-100" style={{ width: w, height: h }} />;
}

// ─── Company section ──────────────────────────────────────────────────────────

function CompanySection({ company, isActive, siiConnected, onConfigureSii }: {
  company: Company;
  isActive: boolean;
  siiConnected: boolean;
  onConfigureSii: () => void;
}) {
  return (
    <div className={[
      "rounded-2xl bg-white overflow-hidden",
      isActive ? "border-2 border-brand" : "border border-gray-200",
    ].join(" ")}>

      {/* Header empresa */}
      <div className="px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 border-b border-gray-50">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
          {company.photo
            ? <img src={company.photo} alt="" className="w-full h-full object-cover" />
            : <span className="text-lg font-bold text-brand">{company.company_name[0]}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm sm:text-[15px] font-semibold text-gray-900 truncate">
            {company.comercial_name || company.company_name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">RUT {company.ruc}</div>
        </div>
        {isActive && (
          <span className="text-[11px] font-semibold text-brand bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
            Activa
          </span>
        )}
      </div>

      {/* Info + integraciones */}
      <div className="px-4 sm:px-5 py-4 flex flex-col gap-4">
        {/* Datos básicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-2.5">
          {[
            { label: "Email comercial", value: company.comercial_email || "—" },
            { label: "Teléfono",        value: company.comercial_phone  || "—" },
            { label: "ID empresa",      value: `#${company.id}` },
            { label: "Razón social",    value: company.company_name },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[11px] text-gray-400 mb-0.5">{label}</div>
              <div className="text-sm text-gray-700 font-medium truncate">{value}</div>
            </div>
          ))}
        </div>

        {/* Integraciones */}
        <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4">
            <StatusDot ok={siiConnected}               label={siiConnected ? "SII conectado" : "SII no conectado"} />
            <StatusDot ok={company.whatsapp.connected} label={company.whatsapp.connected ? `WhatsApp: ${company.whatsapp.phone}` : "WhatsApp no conectado"} />
          </div>
          {!siiConnected && (
            <button
              onClick={onConfigureSii}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Conectar SII
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CuentaPage() {
  const { data: me, isLoading } = useMe();
  const { companyId }           = useAuthStore();
  const { showModal }           = useModalStore();

  function openSiiModal() {
    showModal({
      title: "Configurar SII",
      content: <SiiModalContent />,
      closeOnOutsideClick: true,
      width: "520px",
      modalId: "sii",
    });
  }

  // Empresa activa siempre primera
  const companies = me?.companies
    ? [...me.companies].sort((a, b) => (b.id === companyId ? 1 : 0) - (a.id === companyId ? 1 : 0))
    : [];

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Breadcrumb */}
      <div>
        <p className="text-xs text-gray-400 mb-1">
          Inicio / <span className="text-gray-600 font-medium">Mi cuenta</span>
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Mi cuenta</h1>
      </div>

      {/* Perfil */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 flex-wrap">
        {isLoading
          ? <div className="w-12 h-12 rounded-full bg-gray-100" />
          : <Avatar email={me?.email ?? "?"} photo={me?.photo} size={48} />
        }
        <div className="flex-1 min-w-0">
          {isLoading
            ? <><Sk w={160} h={15} /><div className="mt-1.5"><Sk w={200} h={12} /></div></>
            : <>
                <div className="text-sm sm:text-[15px] font-semibold text-gray-900 truncate">{me?.email}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  ID #{me?.id} · {me?.companies.length ?? 0} empresa{(me?.companies.length ?? 0) !== 1 ? "s" : ""}
                </div>
              </>
          }
        </div>
      </div>

      {/* Empresas */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Empresas registradas
          {me && <span className="ml-1.5 font-normal text-gray-400">({me.companies.length})</span>}
        </h2>

        {isLoading && (
          <div className="rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <Sk w={44} h={44} />
              <div className="flex-1 flex flex-col gap-1.5"><Sk w="50%" h={15} /><Sk w="30%" h={12} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <Sk key={i} h={36} />)}
            </div>
          </div>
        )}

        {!isLoading && companies.map(company => (
          <CompanySection
            key={company.id}
            company={company}
            isActive={company.id === companyId}
            siiConnected={company.has_sii_credentials}
            onConfigureSii={openSiiModal}
          />
        ))}
      </div>
    </div>
  );
}
