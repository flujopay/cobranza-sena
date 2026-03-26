import { apiClient } from "./client";
import type { PaginatedResponse, PaginationParams } from "./types/common";
import type { Payment } from "./types/payments";

export function getPayments(params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
  return apiClient
    .get<PaginatedResponse<Payment>>("/collection/payments/", { params })
    .then((r) => r.data);
}
