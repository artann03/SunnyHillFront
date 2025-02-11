import { Product as ApiProduct, ProductFilters } from '../../models/product.interface';

export type Product = ApiProduct;

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
}

export const initialProductState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    PageNumber: 1,
    PageSize: 9
  }
}; 