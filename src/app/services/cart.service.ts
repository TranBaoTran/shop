import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { CartItem } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})


export class CartService {
  // private items: CartItem[] = [];
  // private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  // cart$ = this.cartItemsSubject.asObservable();
  // totalItems$= new BehaviorSubject<number>(0);

  // constructor(private productService: ProductService) {}

  // // Lấy danh sách
  // getCartItems(): CartItem[] {
  //   return this.items;
  // }

  // addToCart(product: CartItem) {
  //   const existingItem = this.items.find(item => item.productId === product.productId);
  //   if (existingItem) {
  //     existingItem.quantity += product.quantity;
  //   } else {
  //     this.items.push(product);
  //   }
  //   this.updateCartState();
  // }

  //  // Cập nhật tổng số lượng sản phẩm
  //  private updateCartState(): void {
  //   const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  //   this.totalItems$.next(totalQuantity);
  //   this.cartItemsSubject.next(this.items);
  //   this.saveCartToLocalStorage();
  // }

  //  // Cập nhật số lượng sản phẩm trong giỏ hàng
  //  updateQuantity(productId: number, quantity: number): void {
  //   const item = this.items.find(item => item.productId === productId);
  //   if (item) {
  //     item.quantity = quantity;
  //     this.updateCartState();
  //   }
  // }

  // // Xóa sản phẩm khỏi giỏ hàng
  // removeFromCart(productId: number): void {
  //   this.items = this.items.filter(item => item.productId !== productId);
  //   this.updateCartState();
  // }

  // private saveCartToLocalStorage(): void {
  //   localStorage.setItem('cart', JSON.stringify(this.items));
  // }
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private items: CartItem[] = [];
  cartItems$ = this.cartItemsSubject.asObservable();
  totalAmount$ = this.cartItems$.pipe(
    map(cartItems => {
      return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    })
  );
  totalItems$= new BehaviorSubject<number>(0);

  addToCart(item: CartItem) {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = [...currentItems, item];
    this.cartItemsSubject.next(updatedItems);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  updateQuantity(productId: number, quantity: number) {
    const totalQuantity = this.items.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);
    const updatedItems = this.cartItemsSubject.value.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    this.cartItemsSubject.next(updatedItems);
    this.totalItems$.next(totalQuantity);
    
  }

  removeFromCart(productId: number) {
    const updatedItems = this.cartItemsSubject.value.filter(item => item.productId !== productId);
    this.cartItemsSubject.next(updatedItems);
  }
}