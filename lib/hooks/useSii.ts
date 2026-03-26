"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSiiStatus, saveSiiCreds, deleteSiiCreds } from "@/lib/api/sii";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";

// ─── Status ───────────────────────────────────────────────────────────────────

export function useSiiStatus() {
  const companyId = useAuthStore((s) => s.companyId);

  return useQuery({
    queryKey: queryKeys.siiStatus(companyId ?? undefined),
    queryFn:  getSiiStatus,
    enabled:  Boolean(companyId),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ─── Save credentials ─────────────────────────────────────────────────────────

export function useSaveSiiCreds() {
  const queryClient = useQueryClient();
  const companyId   = useAuthStore((s) => s.companyId);

  return useMutation({
    mutationFn: saveSiiCreds,
    onSuccess() {
      // Invalida el status para que se refresque con has_credentials: true
      queryClient.invalidateQueries({ queryKey: queryKeys.siiStatus(companyId ?? undefined) });
      // También invalida /me para actualizar has_sii_credentials en el sidebar
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}

// ─── Delete credentials ───────────────────────────────────────────────────────

export function useDeleteSiiCreds() {
  const queryClient = useQueryClient();
  const companyId   = useAuthStore((s) => s.companyId);

  return useMutation({
    mutationFn: deleteSiiCreds,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKeys.siiStatus(companyId ?? undefined) });
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}
