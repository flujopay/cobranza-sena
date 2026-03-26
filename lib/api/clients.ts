import { apiClient } from "./client";
import type { PaginatedResponse, PaginationParams } from "./types/common";
import type { Client } from "./types/clients";

export function getClients(params?: PaginationParams): Promise<PaginatedResponse<Client>> {
  return apiClient
    .get<PaginatedResponse<Client>>("/collection/clients/", { params })
    .then((r) => r.data);
}
