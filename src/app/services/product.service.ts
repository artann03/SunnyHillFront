import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductFilters, PagedResult } from '../models/product.interface';
import { map } from 'rxjs/operators';

interface PurchaseResponse {
  message: string;
  quantity: number;
  status: string;
}

interface ProductResponse {
  publicId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  status: string;
}

interface UpdateProductDto {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface ProductResponseDto {
  publicId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagedResult<Product>>(`${this.apiUrl}/Products/filter`, { params });
  }

  addProduct(productData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}/Products`, productData);
  }

  buyProduct(publicId: string): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${this.apiUrl}/Products/buy`, { publicId });
  }

  deleteProduct(publicId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Products?id=${publicId}`);
  }

  updateProduct(publicId: string, updateData: UpdateProductDto): Observable<ProductResponseDto> {
    return this.http.put<ProductResponseDto>(`${this.apiUrl}/Products?id=${publicId}`, updateData);
  }
} 