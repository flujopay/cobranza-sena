/**
 * Query keys centralizados para TanStack Query.
 * Usar siempre estas constantes — nunca strings sueltos.
 */
export const queryKeys = {
  me:          ()                    => ["me"]                  as const,
  clientes:    ()                    => ["clientes"]            as const,
  cliente:     (id: number)          => ["clientes", id]        as const,
  documentos:  (companyId?: number)  => ["documentos", companyId] as const,
  pagos:       (companyId?: number)  => ["pagos", companyId]    as const,
  contactos:   (companyId?: number)  => ["contactos", companyId] as const,
  plantillas:  (companyId?: number)  => ["plantillas", companyId] as const,
  siiStatus:   (companyId?: number)  => ["sii", "status", companyId] as const,
} as const;
