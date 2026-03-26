"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWhatsAppInstance,
  getWhatsAppStatus,
  sendWhatsAppMessage,
  deleteWhatsAppInstance,
} from "@/lib/api/whatsapp";
import { useAuthStore } from "@/store/authStore";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const whatsappKeys = {
  status: (companyId?: number) => ["whatsapp", "status", companyId] as const,
};

// ─── useWhatsAppStatus — polling cada 5s hasta que esté ready ─────────────────

export function useWhatsAppStatus({ enabled = true }: { enabled?: boolean } = {}) {
  const companyId   = useAuthStore((s) => s.companyId);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: whatsappKeys.status(companyId ?? undefined),
    queryFn:  getWhatsAppStatus,
    enabled:  Boolean(companyId) && enabled,
    staleTime: 0,
    // Refresca cada 5s mientras no esté conectado
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 5_000;
      return data.connected ? false : 5_000;
    },
    refetchIntervalInBackground: false,
  });

  // ─── WebSocket — escucha eventos del servidor ──────────────────────────────
  const companyUserId  = useAuthStore((s) => s.activeCompany?.company_user_id);
  const wsRef          = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!companyId || !companyUserId || !enabled) return;

    const wsBase = (process.env.NEXT_PUBLIC_WS_URL ?? "wss://dev.mv.flujolink.com")
      .replace(/^http/, "ws");
    const channel = `event_collection_whatsapp_${companyId}_${companyUserId}`;
    const url     = `${wsBase}/ws/${channel}/`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = () => {
      // Cualquier evento del canal invalida el status → refetch inmediato
      queryClient.invalidateQueries({ queryKey: whatsappKeys.status(companyId) });
    };

    ws.onerror = () => { /* silencioso — el polling HTTP cubre la brecha */ };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [companyId, companyUserId, enabled, queryClient]);

  return query;
}

// ─── useCreateWhatsAppInstance ────────────────────────────────────────────────

export function useCreateWhatsAppInstance() {
  return useMutation({
    mutationFn: createWhatsAppInstance,
    // No invalidamos status aquí — el polling en useWhatsAppStatus lo maneja
  });
}

// ─── useSendWhatsAppMessage ───────────────────────────────────────────────────

export function useSendWhatsAppMessage() {
  return useMutation({ mutationFn: sendWhatsAppMessage });
}

// ─── useDeleteWhatsAppInstance ────────────────────────────────────────────────

export function useDeleteWhatsAppInstance() {
  const queryClient = useQueryClient();
  const companyId   = useAuthStore((s) => s.companyId);

  return useMutation({
    mutationFn: deleteWhatsAppInstance,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: whatsappKeys.status(companyId ?? undefined) });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
