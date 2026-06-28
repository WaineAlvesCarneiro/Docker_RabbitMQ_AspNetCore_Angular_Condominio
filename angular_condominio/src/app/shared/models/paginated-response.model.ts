export interface PaginatedResponse<T> {
  sucesso: boolean;
  dados: {
    items: T[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
  };
  erro?: string;
}
