"use client";

import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/lib/api/clients";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";
import type { PaginationParams } from "@/lib/api/types/common";

export function useClients(params?: PaginationParams) {
  const companyId = useAuthStore((s) => s.companyId);

  return useQuery({
    queryKey: queryKeys.clientList(companyId!, params),
    queryFn:  () => getClients(params),
    enabled:  Boolean(companyId),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev, // mantiene data anterior mientras carga nueva página
  });
}
