export interface GetPaginatedUsers {
  content: [{ id: number; fullName: string; email: string; roles: string[] }];
  pageable: {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: { sorted: boolean; empty: boolean };
  };
  size: number;
  totalElements: number;
  totalPages: number;
}
