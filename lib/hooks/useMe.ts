"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/users";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/authStore";

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    enabled: Boolean(accessToken), // solo fetcha si hay sesión
    staleTime: 1000 * 60 * 5,
  });
}
