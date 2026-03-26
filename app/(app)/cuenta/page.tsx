"use client";

import { useMe } from "@/lib/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { useSiiStatus } from "@/lib/hooks/useSii";
import { useModalStore } from "@/store/modalStore";
import { SiiModalContent } from "@/components/integraciones/modals/SiiModalContent";
import type { Company } from "@/lib/api/types/auth";

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ email, photo, size = 48 }: { email: string; photo?: string | null; size?: number }) {
  const initial = email[0]?.toUpperCase() ?? "?";
  if (photo) return <img src={photo} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #3771D1 0%, #5b90e8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: size * 0.38, fontWeight: 700,
    }}>{initial}</div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: ok ? "#16a34a" : "#6b7280" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: ok ? "#22c55e" : "#d1d5db", display: "inline-block", flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Sk({ w = "100%", h = 14 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, borderRadius: 6, background: "#f3f4f6" }} />;
}

// ─── Company section ──────────────────────────────────────────────────────────

function CompanySection({ company, isActive, siiConnected, onConfigureSii }: {
  company: Company;
  isActive: boolean;
  siiConnected: boolean;
  onConfigureSii: () => void;
}) {
  return (
    <div style={{
      border: isActive ? "2px solid #3771D1" : "1.5px solid #e5e7eb",
      borderRadius: 14, background: "#fff", overflow: "hidden",
    }}>
      {/* Header empresa */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
          {company.photo
            ? <img src={company.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 18, fontWeight: 700, color: "#3771D1" }}>{company.company_name[0]}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {company.comercial_name || company.company_name}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>RUT {company.ruc}</div>
        </div>
        {isActive && (
          <span style={{ fontSize: 11, fontWeight: 600, color: "#3771D1", background: "#dbeafe", padding: "3px 10px", borderRadius: 20 }}>
            Activa
          </span>
        )}
      </div>

      {/* Info + integraciones */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Datos básicos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
          {[
            { label: "Email comercial", value: company.comercial_email || "—" },
            { label: "Teléfono",        value: company.comercial_phone  || "—" },
            { label: "ID empresa",      value: `#${company.id}` },
            { label: "Razón social",    value: company.company_name },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Integraciones */}
        <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <StatusDot ok={siiConnected}               label={siiConnected ? "SII conectado" : "SII no conectado"} />
            <StatusDot ok={company.whatsapp.connected} label={company.whatsapp.connected ? `WhatsApp: ${company.whatsapp.phone}` : "WhatsApp no conectado"} />
          </div>
          {/* Acceso directo a configurar SII sin salir de la página */}
          {!siiConnected && (
            <button
              onClick={onConfigureSii}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "#3771D1", color: "#fff", border: "none", cursor: "pointer",
              }}
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
  const { data: me, isLoading }     = useMe();
  const { data: siiStatus }         = useSiiStatus();
  const { companyId }               = useAuthStore();
  const { showModal }               = useModalStore();

  function openSiiModal() {
    showModal({
      title: "Configurar SII",
      content: <SiiModalContent />,
      closeOnOutsideClick: true,
      width: "520px",
      modalId: "sii",
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
      {/* Breadcrumb */}
      <div>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>
          Inicio / <span style={{ color: "#374151", fontWeight: 500 }}>Mi cuenta</span>
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111827" }}>Mi cuenta</h1>
      </div>

      {/* Perfil + empresa en una sola card horizontal */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {isLoading
          ? <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f3f4f6" }} />
          : <Avatar email={me?.email ?? "?"} photo={me?.photo} size={48} />
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          {isLoading
            ? <><Sk w={160} h={15} /><div style={{ marginTop: 6 }}><Sk w={200} h={12} /></div></>
            : <>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{me?.email}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>ID #{me?.id} · {me?.companies.length ?? 0} empresa{(me?.companies.length ?? 0) !== 1 ? "s" : ""}</div>
              </>
          }
        </div>
      </div>

      {/* Empresas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
          Empresas registradas
          {me && <span style={{ marginLeft: 6, fontWeight: 400, color: "#9ca3af" }}>({me.companies.length})</span>}
        </h2>

        {isLoading && (
          <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Sk w={44} h={44} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}><Sk w="50%" h={15} /><Sk w="30%" h={12} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
              {[1,2,3,4].map(i => <Sk key={i} h={36} />)}
            </div>
          </div>
        )}

        {!isLoading && me?.companies.map(company => (
          <CompanySection
            key={company.id}
            company={company}
            isActive={company.id === companyId}
            siiConnected={siiStatus?.has_credentials ?? false}
            onConfigureSii={openSiiModal}
          />
        ))}
      </div>
    </div>
  );
}
