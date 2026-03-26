// ─── Paginación ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  results: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
