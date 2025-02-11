import { createReducer, on } from '@ngrx/store';
import { initialProductState } from './product.types';
import * as ProductActions from './product.actions';

export const productReducer = createReducer(
  initialProductState,
  on(ProductActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductActions.addProduct, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    loading: false
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 