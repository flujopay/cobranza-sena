"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SenaLogo } from "@/components/ui/SenaLogo";
import { useModalStore } from "@/store/modalStore";
import { SiiModalContent } from "@/components/integraciones/modals/SiiModalContent";
import { useMe } from "@/lib/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSiiStatus } from "@/lib/hooks/useSii";
import type { Company } from "@/lib/api/types/auth";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Inicio",
    href: "/inicio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Documentos",
    href: "/documentos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    label: "Contactos",
    href: "/contactos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Pagos",
    href: "/pagos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M7 15h2" />
      </svg>
    ),
  },
  {
    label: "Plantillas",
    href: "/plantillas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" />
        <line x1="7" y1="11" x2="17" y2="6" /><line x1="7" y1="13" x2="17" y2="18" />
      </svg>
    ),
  },
  {
    label: "Integraciones",
    href: "/integraciones",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" />
        <line x1="7" y1="6" x2="17" y2="6" /><line x1="6" y1="8" x2="11" y2="16" /><line x1="18" y1="8" x2="13" y2="16" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname      = usePathname();
  const router        = useRouter();
  const { showModal } = useModalStore();
  const { data: me }  = useMe();
  const { clearSession, companyId, setSession, accessToken, refreshToken } = useAuthStore();
  const queryClient   = useQueryClient();
  const { data: siiStatus } = useSiiStatus();
  const siiConnected = siiStatus?.has_credentials ?? false;

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [collapsed,    setCollapsed]    = useState(false);
  const [search,       setSearch]       = useState("");

  const companies: Company[] = me?.companies ?? [];
  const empresaActiva = companies.find(c => c.id === companyId) ?? companies[0] ?? null;

  const filtered = search
    ? companies.filter(c =>
        c.company_name.toLowerCase().includes(search.toLowerCase()) ||
        c.comercial_name.toLowerCase().includes(search.toLowerCase())
      )
    : companies;

  function selectEmpresa(company: Company) {
    if (accessToken && refreshToken) {
      setSession({ access_token: accessToken, refresh_token: refreshToken, company_id: company.id });
    }
    setSelectorOpen(false);
    setSearch("");
  }

  function handleLogout() {
    clearSession();
    queryClient.clear();
    router.push("/login");
  }

  function abrirSII() {
    showModal({
      title: "Integración SII",
      content: <SiiModalContent />,
      closeOnOutsideClick: true,
      width: "480px",
      modalId: "sii-sync",
    });
  }

  const initials = me
    ? `${me.name?.[0] ?? ""}${me.lastname?.[0] ?? ""}`.toUpperCase() || me.email[0].toUpperCase()
    : "…";

  return (
    <aside
      style={{
        width: collapsed ? 80 : 276,
        minWidth: collapsed ? 80 : 276,
        transition: "width 0.2s, min-width 0.2s",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        userSelect: "none",
        flexShrink: 0,
        padding: "8px 0 8px 8px",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Botón colapso */}
      <button
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? "Expandir" : "Colapsar"}
        style={{
          position: "absolute", top: 24, right: -12, zIndex: 20,
          width: 24, height: 24, borderRadius: "50%",
          background: "#fff", border: "1.5px solid #d1d5db",
          boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#3771D1", cursor: "pointer", transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#3771D1"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "#3771D1"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#3771D1"; (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
        </svg>
      </button>

      {/* Contenedor flotante */}
      <div style={{ background: "#3771D1", borderRadius: 16, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", boxShadow: "0 4px 24px rgba(55,113,209,0.25)" }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? "16px 8px" : "16px 14px", borderBottom: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", minHeight: 60 }}>
          {!collapsed
            ? <SenaLogo variant="white" height={28} />
            : <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
          }
        </div>

        {/* Workspace selector */}
        <div style={{ padding: collapsed ? "8px 6px" : "10px 10px", borderBottom: "1px solid rgba(255,255,255,0.12)", position: "relative" }}>
          <button
            onClick={() => setSelectorOpen(v => !v)}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8, background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: 8, padding: collapsed ? "7px 6px" : "8px 10px",
              cursor: "pointer", color: "#fff", textAlign: "left", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {empresaActiva?.photo
                ? <img src={empresaActiva.photo} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: "cover" }} />
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
              }
            </div>
            {!collapsed && (
              <>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#fff" }}>
                  {empresaActiva ? (empresaActiva.comercial_name || empresaActiva.company_name) : "Cargando…"}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: selectorOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>

          {/* Dropdown empresas */}
          {selectorOpen && !collapsed && (
            <div style={{ position: "absolute", left: 10, right: 10, top: "100%", marginTop: 4, zIndex: 50, background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", overflow: "hidden" }}>
              {companies.length > 1 && (
                <div style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  <input
                    type="text"
                    placeholder="Buscar empresa…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", fontSize: 12, padding: "6px 10px", borderRadius: 7, border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", boxSizing: "border-box" }}
                  />
                </div>
              )}
              {/* Crear empresa — comentado hasta que exista el endpoint */}
              {/* <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", fontSize: 12, color: "#3771D1", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Crear empresa
              </button> */}
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {filtered.length === 0 && (
                  <p style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>Sin resultados</p>
                )}
                {filtered.map(company => {
                  const isActive = company.id === (empresaActiva?.id);
                  return (
                    <button key={company.id}
                      onClick={() => selectEmpresa(company)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 12px", fontSize: 12, border: "none", cursor: "pointer", textAlign: "left",
                        background: isActive ? "#eef3fc" : "transparent",
                        color: isActive ? "#3771D1" : "#374151",
                        fontWeight: isActive ? 600 : 400,
                      }}>
                      <div style={{ width: 24, height: 24, borderRadius: 5, background: isActive ? "#3771D1" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {company.photo
                          ? <img src={company.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ color: isActive ? "#fff" : "#6b7280", fontSize: 10, fontWeight: 700 }}>{company.company_name[0]}</span>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {company.comercial_name || company.company_name}
                        </div>
                        <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {company.ruc}
                        </div>
                      </div>
                      {isActive && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3771D1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Banner SII */}
        <div style={{ padding: collapsed ? "8px 6px 0" : "8px 10px 0" }}>
          <button
            onClick={abrirSII}
            title={siiConnected ? "SII conectado" : "Sincronizar SII"}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 8,
              background: siiConnected ? "#f0fdf4" : "#FFF8DD",
              border: siiConnected ? "1px solid #bbf7d0" : "1px solid #f5e3a8",
              borderRadius: 8,
              padding: collapsed ? "8px 6px" : "8px 12px",
              cursor: "pointer", textAlign: "left", transition: "background 0.15s",
              color: siiConnected ? "#16a34a" : "#F6B100",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = siiConnected ? "#dcfce7" : "#fef3c7")}
            onMouseLeave={e => (e.currentTarget.style.background = siiConnected ? "#f0fdf4" : "#FFF8DD")}
          >
            {siiConnected ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M2.98 13.6694H13.02C14.0467 13.6694 14.6867 12.5561 14.1733 11.6694L9.15333 2.99605C8.64 2.10939 7.36 2.10939 6.84667 2.99605L1.82667 11.6694C1.31333 12.5561 1.95333 13.6694 2.98 13.6694ZM8 9.00272C7.63333 9.00272 7.33333 8.70272 7.33333 8.33606V7.00272C7.33333 6.63605 7.63333 6.33605 8 6.33605C8.36667 6.33605 8.66667 6.63605 8.66667 7.00272V8.33606C8.66667 8.70272 8.36667 9.00272 8 9.00272ZM8.66667 11.6694H7.33333V10.3361H8.66667V11.6694Z" />
              </svg>
            )}
            {!collapsed && (
              <>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {siiConnected ? "SII conectado" : "Sincronizar SII"}
                </span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M12.6667 12.6667H3.33333V3.33333H8V2H3.33333C2.59333 2 2 2.6 2 3.33333V12.6667C2 13.4 2.59333 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V8H12.6667V12.6667ZM9.33333 2V3.33333H11.7267L5.17333 9.88667L6.11333 10.8267L12.6667 4.27333V6.66667H14V2H9.33333Z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Etiqueta sección */}
        {!collapsed && (
          <div style={{ padding: "10px 14px 4px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Menú
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : 10, padding: collapsed ? "10px 6px" : "9px 10px",
                  borderRadius: 8, fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  background: active ? "#ffffff" : "transparent",
                  color: active ? "#3771D1" : "rgba(255,255,255,0.90)",
                  textDecoration: "none", transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.90)"; } }}
              >
                <span style={{ flexShrink: 0, display: "flex", opacity: 1 }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                )}
                {active && !collapsed && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3771D1", flexShrink: 0, opacity: 0.7 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer usuario */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "8px" }}>
          <Link
            href="/cuenta"
            style={{
              display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8, padding: "7px 8px", borderRadius: 8,
              textDecoration: "none", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {me?.photo
                ? <img src={me.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{initials}</span>
              }
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {me ? `${me.name} ${me.lastname}`.trim() || me.email : "…"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {me?.email ?? ""}
                </div>
              </div>
            )}
          </Link>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 8, padding: collapsed ? "7px 6px" : "7px 10px",
              borderRadius: 8, border: "none", background: "transparent",
              color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>

      </div>{/* fin contenedor flotante */}
    </aside>
  );
}
