"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/users";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";

export function useMe() {
  const accessToken        = useAuthStore((s) => s.accessToken);
  const companyId          = useAuthStore((s) => s.companyId);
  const setActiveCompany   = useAuthStore((s) => s.setActiveCompany);

  const query = useQuery({
    queryKey: queryKeys.me(),
    queryFn:  getMe,
    enabled:  Boolean(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  // Cada vez que /me responde, actualiza activeCompany en el store
  useEffect(() => {
    if (query.data && companyId) {
      setActiveCompany(query.data.companies, companyId);
    }
  }, [query.data, companyId, setActiveCompany]);

  return query;
}
