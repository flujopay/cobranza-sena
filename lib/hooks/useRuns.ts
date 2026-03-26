"use client";

import { useQuery } from "@tanstack/react-query";
import { getRuns } from "@/lib/api/runs";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";

export function useRuns(page = 1) {
  const companyId = useAuthStore((s) => s.companyId);

  return useQuery({
    queryKey:  queryKeys.runList(companyId!, page),
    queryFn:   () => getRuns({ page }),
    enabled:   Boolean(companyId),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
}
