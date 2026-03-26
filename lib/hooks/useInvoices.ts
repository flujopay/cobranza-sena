"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/lib/api/invoices";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";
import type { PaginationParams } from "@/lib/api/types/common";

export function useInvoices(params?: PaginationParams) {
  const companyId = useAuthStore((s) => s.companyId);

  return useQuery({
    queryKey: queryKeys.invoiceList(companyId!, params),
    queryFn:  () => getInvoices(params),
    enabled:  Boolean(companyId),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
}
