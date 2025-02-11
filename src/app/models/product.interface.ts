export interface Product {
  publicId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  status: string;
}

export interface ProductFilters {
  IsInStock?: boolean | null;
  NameStartsWith?: string;
  OrderByDescending?: boolean | null;
  PageNumber: number;
  PageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
} 