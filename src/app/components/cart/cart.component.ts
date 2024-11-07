import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  // cập nhật tự động
  cartItems: CartItem[] = [];
  totalAmount$: Observable<number>;  

  constructor(private cartService: CartService) {
    this.totalAmount$ = this.cartService.totalAmount$;
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;  // Cập nhật cartItems khi có sự thay đổi
    });
  }

  // getTotalAmount(): number {
  //   let total = 0;
  //   this.cartItems$.subscribe(cartItems => {
  //     total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  //   });
  //   return total;
  // }
  
  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.cartService.updateQuantity(item.productId, item.quantity);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.productId && item.quantity > 1) {
      item.quantity--;
      this.cartService.updateQuantity(item.productId, item.quantity);
    }
  }

  removeFromCart(item: CartItem): void {
    if (item.productId) {
      this.cartService.removeFromCart(item.productId);
    }
  }

  // checkout(): void {
  //   alert('Proceeding to checkout with total amount: ' + this.getTotalAmount());
  // }
  checkout(): void {
    this.totalAmount$.subscribe(totalAmount => {
      alert('Proceeding to checkout with total amount: ' + totalAmount);
    });
  }
}
