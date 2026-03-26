import type { PaginationParams } from "./types/common";

/**
 * Query keys centralizados para TanStack Query.
 * Usar siempre estas constantes — nunca strings sueltos.
 *
 * Convención:
 *  - clave base (sin params) → invalida TODO el recurso en el queryClient
 *  - clave con params        → entrada específica en cache (paginación, filtros)
 */
export const queryKeys = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  me: () => ["me"] as const,

  // ─── SII ───────────────────────────────────────────────────────────────────
  siiStatus: (companyId?: number) => ["sii", "status", companyId] as const,

  // ─── Clientes ──────────────────────────────────────────────────────────────
  clients:    ()                                         => ["clients"]                        as const,
  clientList: (companyId: number, p?: PaginationParams) => ["clients", "list", companyId, p]  as const,

  // ─── Facturas ──────────────────────────────────────────────────────────────
  invoices:    ()                                         => ["invoices"]                       as const,
  invoiceList: (companyId: number, p?: PaginationParams) => ["invoices", "list", companyId, p] as const,

  // ─── Pagos ─────────────────────────────────────────────────────────────────
  payments:    ()                                         => ["payments"]                       as const,
  paymentList: (companyId: number, p?: PaginationParams) => ["payments", "list", companyId, p] as const,

  // ─── Contactos ─────────────────────────────────────────────────────────────
  contacts:    ()                                         => ["contacts"]                       as const,
  contactList: (companyId: number, p?: PaginationParams) => ["contacts", "list", companyId, p] as const,

  // ─── Plantillas (futuro) ───────────────────────────────────────────────────
  plantillas: (companyId?: number) => ["plantillas", companyId] as const,

  // ─── Corridas del Bot ─────────────────────────────────────────────────────
  runs:    ()                             => ["runs"]                       as const,
  runList: (companyId: number, page = 1) => ["runs", "list", companyId, page] as const,
} as const;
