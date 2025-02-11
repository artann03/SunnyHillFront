import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product.interface';
import { ProductFilters } from '../../models/product.interface';
import { CreateProductDto } from '../../models/product-create.interface';

export const loadProducts = createAction(
  '[Product] Load Products',
  props<{ filters: ProductFilters }>()
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

export const addProduct = createAction(
  '[Product] Add Product',
  props<{ product: CreateProductDto }>()
);

export const addProductSuccess = createAction(
  '[Product] Add Product Success',
  props<{ product: Product }>()
);

export const addProductFailure = createAction(
  '[Product] Add Product Failure',
  props<{ error: string }>()
); 