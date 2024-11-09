import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/product.model';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class CartService {
  cartItems: CartItem[] = []; 
  private totalAmountSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private cartSubject = new BehaviorSubject<Cart[]>([]);

  cart$ = this.cartSubject.asObservable();
  totalAmount$ = this.totalAmountSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  private apiUrl = 'https://fakestoreapi.com/carts';

  constructor(private http: HttpClient) {
    this.loadCartFromLocalStorage();
  }

  addCart(cart:{ productId: number, date: String, quantity: number, userId: number }): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cart);
  }

  getCart(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.apiUrl);
  }
  
  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.updateCartState();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  private updateCartState(): void {
    const totalAmount = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    // phát giá trị
    this.totalAmountSubject.next(totalAmount);
    this.totalItemsSubject.next(totalQuantity);
    this.saveCartToLocalStorage();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(cartItem => cartItem.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCartState();
    }
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.updateCartState();
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCartState();
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCartState();
    }
  }

  getUserCart(id : number): Observable<Cart[]>{
    return this.http.get<Cart[]>(`${this.apiUrl}/user/${id}`);
  }

  getAll(): Observable<Cart[]>{
    return this.http.get<Cart[]>(`${this.apiUrl}`);
  }

  getByDateRange(start : string, end : string): Observable<Cart[]>{
    return this.http.get<Cart[]>(this.apiUrl, {params: {startdate: start, enddate: end}});
  }
}