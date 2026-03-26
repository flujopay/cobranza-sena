import { apiClient } from "./client";
import type { PaginatedResponse, PaginationParams } from "./types/common";
import type { Contact } from "./types/contacts";

export function getContacts(params?: PaginationParams): Promise<PaginatedResponse<Contact>> {
  return apiClient
    .get<PaginatedResponse<Contact>>("/collection/contacts/", { params })
    .then((r) => r.data);
}
