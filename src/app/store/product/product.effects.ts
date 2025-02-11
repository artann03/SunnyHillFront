import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import * as ProductActions from './product.actions';
import { CreateProductDto } from '../../models/product-create.interface';

@Injectable()
export class ProductEffects {
  loadProducts$: any;
  addProduct$: any;

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {
    console.log('[ProductEffects] Constructor called');

    this.loadProducts$ = createEffect(() => {
      console.log('[ProductEffects] loadProducts$ effect created');
      return this.actions$.pipe(
        ofType(ProductActions.loadProducts),
        mergeMap(({ filters }) => 
          this.productService.getProducts(filters).pipe(
            map(response => ProductActions.loadProductsSuccess({ 
              products: response.items
            })),
            catchError(error => 
              of(ProductActions.loadProductsFailure({ 
                error: error.message || 'Failed to load products' 
              }))
            )
          )
        )
      );
    });

    this.addProduct$ = createEffect(() => {
      console.log('[ProductEffects] addProduct$ effect created');
      return this.actions$.pipe(
        ofType(ProductActions.addProduct),
        mergeMap(({ product }) => {
          const formData = new FormData();
          const typedProduct = product as CreateProductDto;
          
          formData.append('name', typedProduct.name);
          formData.append('description', typedProduct.description);
          formData.append('image', typedProduct.image);
          formData.append('price', typedProduct.price.toString());
          formData.append('quantity', typedProduct.quantity.toString());
          
          return this.productService.addProduct(formData).pipe(
            map(newProduct => ProductActions.addProductSuccess({ product: newProduct })),
            catchError(error =>
              of(ProductActions.addProductFailure({ 
                error: error.message || 'Failed to add product' 
              }))
            )
          );
        })
      );
    });
  }
} 