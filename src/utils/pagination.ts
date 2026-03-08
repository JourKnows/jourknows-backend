const DEFAULT_PAGE_SIZE = 10;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: { page?: string }): PaginationParams {
  const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
  const limit = DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
