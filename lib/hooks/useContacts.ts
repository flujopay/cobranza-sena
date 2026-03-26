"use client";

import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/lib/api/contacts";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";
import type { PaginationParams } from "@/lib/api/types/common";

export function useContacts(params?: PaginationParams) {
  const companyId = useAuthStore((s) => s.companyId);

  return useQuery({
    queryKey: queryKeys.contactList(companyId!, params),
    queryFn:  () => getContacts(params),
    enabled:  Boolean(companyId),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
}
