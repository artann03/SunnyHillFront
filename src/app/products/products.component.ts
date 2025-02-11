import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ProductService } from '../services/product.service';
import { Product, ProductFilters, PagedResult } from '../models/product.interface';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateProductModalComponent } from './update-product-modal/update-product-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    FooterComponent,
    AddProductModalComponent,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    UpdateProductModalComponent,
    TranslateModule,
    MatFormFieldModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  loading = false;
  hasMoreProducts = false;
  searchTerm = '';
  totalCount = 0;
  isShowingMore = false;
  private searchSubject = new BehaviorSubject<string>('');
  
  filters: ProductFilters = {
    PageNumber: 1,
    PageSize: 9,
    IsInStock: null,
    OrderByDescending: null
  };

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('ProductService:', this.productService);
    console.log('AuthService:', this.authService);
    console.log('Router:', this.router);
    console.log('SnackBar:', this.snackBar);
    console.log('Dialog:', this.dialog);
  }

  ngOnInit(): void {
    this.loadProducts();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filters.NameStartsWith = searchTerm;
      this.filters.PageNumber = 1;
      this.loadProducts();
    });
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }

  loadProducts(): void {
    this.loading = true;
    this.filters.PageNumber = 1;
    this.products = [];
    this.isShowingMore = false;
    
    this.productService.getProducts(this.filters).subscribe({
      next: (response: PagedResult<Product>) => {
        this.products = response.items;
        this.totalCount = response.totalCount;
        this.hasMoreProducts = response.hasNextPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.snackBar.open('Error loading products', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userRole') === 'Admin';
    }
    return false;
  }

  addNewProduct(): void {
    const dialogRef = this.dialog.open(AddProductModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe({
          next: (response) => {
            this.snackBar.open('Product added successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error adding product:', error);
            this.snackBar.open('Failed to add product', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  buyProduct(publicId: string): void {
    this.productService.buyProduct(publicId).subscribe({
      next: (response) => {
        this.snackBar.open('Purchase successful!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error purchasing product:', error);
        this.snackBar.open('Failed to purchase product', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteProduct(publicId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(publicId).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Failed to delete product', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  /**
   * Determines if any filter other than pagination is active.
   * @returns {boolean} True if any filter is active, otherwise false.
   */
  hasActiveFilters(): boolean {
    const { IsInStock, NameStartsWith, OrderByDescending } = this.filters;
    return (
      IsInStock !== undefined ||
      !!NameStartsWith ||
      OrderByDescending !== undefined
    );
  }

  updateProduct(product: Product): void {
    const dialogRef = this.dialog.open(UpdateProductModalComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product.publicId, result).subscribe({
          next: (response) => {
            this.snackBar.open('Product updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.snackBar.open('Failed to update product', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  loadMoreProducts(): void {
    if (this.loading) return;
    
    if (this.isShowingMore) {
      // Show less - reset to first page
      this.filters.PageNumber = 1;
      this.isShowingMore = false;
      this.loadProducts();
    } else {
      // Show more - load next page
      this.loading = true;
      this.filters.PageNumber++;
      
      this.productService.getProducts(this.filters).subscribe({
        next: (response: PagedResult<Product>) => {
          this.products = [...this.products, ...response.items];
          this.hasMoreProducts = response.hasNextPage;
          this.isShowingMore = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading more products:', error);
          this.loading = false;
          this.snackBar.open('Error loading more products', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
