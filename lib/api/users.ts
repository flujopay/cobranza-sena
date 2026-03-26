import { apiGet } from "./client";
import type { MeResponse } from "./types/auth";

export function getMe(): Promise<MeResponse> {
  return apiGet<MeResponse>("/collection/users/me/");
}
