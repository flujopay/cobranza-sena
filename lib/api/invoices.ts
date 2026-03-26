import { apiClient } from "./client";
import type { PaginatedResponse, PaginationParams } from "./types/common";
import type { Invoice } from "./types/invoices";

export function getInvoices(params?: PaginationParams): Promise<PaginatedResponse<Invoice>> {
  return apiClient
    .get<PaginatedResponse<Invoice>>("/collection/invoices/", { params })
    .then((r) => r.data);
}
