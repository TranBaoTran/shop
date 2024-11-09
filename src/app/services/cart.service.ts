import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable, of } from 'rxjs';

import { Cart, CartItem } from '../models/product.model';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private totalAmountSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private cartSubject = new BehaviorSubject<Cart[]>([]); // Chỉ chứa Cart (giỏ hàng)
  
  cartItems$ = this.cartItemsSubject.asObservable();
  cart$ = this.cartSubject.asObservable();
  totalAmount$ = this.totalAmountSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  private apiUrl = 'https://fakestoreapi.com/carts';


  constructor(private http: HttpClient, private productService: ProductService) {
    this.loadCartFromLocalStorage();
  }

  addCart(cart: {id: number, productId: number, date: string, quantity: number, userId: number }): Observable<Cart> {
    const userId = localStorage.getItem('userid');

    if (!userId) {
      console.error('User ID is not found in localStorage');
      return of(); 
    }
  
    return this.productService.getProductById(cart.productId).pipe(
      map(product => {
        const cartItem: CartItem = {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: cart.quantity,
          image: product.image
        };
  
        this.addToCart(cartItem);
  
        const newCart: Cart = {
          id: cart.id, 
          userId: Number(userId), 
          date: cart.date,
          products: [
            { productId: cart.productId, quantity: cart.quantity } 
          ]
        };
  
        this.http.post<Cart>(this.apiUrl, newCart).subscribe(response => {
          console.log('Cart saved to API:', response);
          this.updateCartState(); // Cập nhật giỏ hàng cục bộ
        });
  
        // Lưu giỏ hàng vào localStorage
        this.saveCartItemToLocalStorage();
        return newCart; 
      })
    );
  }
  

  // Thêm sản phẩm vào giỏ hàng
  addToCart(item: CartItem): void {
    let currentCartItems  = this.cartItemsSubject.getValue();
    const existingItem = currentCartItems .find(cartItem => cartItem.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity; // Cập nhật số lượng nếu sản phẩm đã tồn tại
    } else {
      currentCartItems .push(item); // Thêm mới item vào giỏ hàng
    }
    this.updateCartState();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  // Cập nhật trạng thái giỏ hàng (giỏ hàng là Cart[], không phải CartItem[])
  private updateCartState(): void {
    const currentCartItems = this.cartItemsSubject.getValue();
    const totalAmount = currentCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = currentCartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Phát giá trị cho tổng tiền và tổng số lượng
    this.totalAmountSubject.next(totalAmount);
    this.totalItemsSubject.next(totalQuantity);

    const userId = localStorage.getItem('userid');

    // Cập nhật giỏ hàng (cartSubject) chứa Cart[]
    const cartState: Cart[] = [
      {
        id:Number(userId),
        userId: Number(userId),
        date: Date.now.toString(),
        products: currentCartItems.map(item => ({ productId: item.productId, quantity: item.quantity })) // Danh sách sản phẩm trong giỏ hàng
      }
    ];
    this.cartSubject.next(cartState);

    // Lưu giỏ hàng vào localStorage
    this.saveCartItemToLocalStorage();
  }

  // Lưu giỏ hàng vào localStorage
  private saveCartItemToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.getValue())); // Lưu CartItem[]
    localStorage.setItem('totalAmount', JSON.stringify(this.totalAmountSubject.value)); // Lưu tổng tiền
    localStorage.setItem('totalItems', JSON.stringify(this.totalItemsSubject.value)); // Lưu tổng số lượng
  }

  // Tải giỏ hàng từ localStorage
  private loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
      this.updateCartState(); // Cập nhật lại trạng thái giỏ hàng
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(productId: number, quantity: number) {
    const currentCartItems = this.cartItemsSubject.getValue();
    const item = currentCartItems.find(cartItem => cartItem.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCartState();
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId: number) {
    const updatedCartItems = this.cartItemsSubject.getValue().filter(item => item.productId !== productId);
    this.cartItemsSubject.next(updatedCartItems);
    this.updateCartState();
  }

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.updateCartState();
  }

  // Lấy tất cả giỏ hàng của người dùng từ API
  getUserCart(id: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/user/${id}`);
  }

  // Lấy tất cả các giỏ hàng từ API
  getAll(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}`);
  }

  // Lấy giỏ hàng theo khoảng thời gian từ API
  getByDateRange(start: string, end: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.apiUrl, { params: { startdate: start, enddate: end } });
  }
}