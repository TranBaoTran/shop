import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  addProduct(product: { title: string, price: number, description: string, image: string, category: string }): Observable<Product> {
    product.image = "https://i.pravatar.cc";
    return this.http.post<Product>(this.apiUrl, product);
  }

  deleteProduct(id : number): Observable<Product>{
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id : number, product: { title: string, price: number, description: string, image: string, category: string }): Observable<Product>{
    product.image = "https://i.pravatar.cc";
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
}
