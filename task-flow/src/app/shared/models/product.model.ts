export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}