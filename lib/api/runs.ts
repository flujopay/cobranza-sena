import { apiClient } from "./client";
import type { PaginatedResponse } from "./types/common";
import type { CollectionRun } from "./types/runs";

export function getRuns(params?: { page?: number }): Promise<PaginatedResponse<CollectionRun>> {
  return apiClient
    .get<PaginatedResponse<CollectionRun>>("/collection/runs/", { params })
    .then((r) => r.data);
}
