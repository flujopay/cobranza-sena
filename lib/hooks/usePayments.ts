"use client";

import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/lib/api/payments";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";
import type { PaginationParams } from "@/lib/api/types/common";

export function usePayments(params?: PaginationParams) {
  const companyId = useAuthStore((s) => s.companyId);

  return useQuery({
    queryKey: queryKeys.paymentList(companyId!, params),
    queryFn:  () => getPayments(params),
    enabled:  Boolean(companyId),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
}
