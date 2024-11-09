import { Component } from '@angular/core';
import { CartItem } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  totalAmount$: Observable<number>;
  inputQuantity: number = 1;
  currentUserId: number | null = null;

  constructor(private cartService: CartService, private router: Router) {
    this.totalAmount$ = this.cartService.totalAmount$;
    this.currentUserId = Number(localStorage.getItem('userid'));
    this.cartItems$ = this.cartService.getCartItems();
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.cartService.updateQuantity(item.productId, item.quantity);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateQuantity(item.productId, item.quantity);
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.productId);
    this.cartItems$ = this.cartService.getCartItems(); // Cập nhật danh sách sau khi xóa
  }

  checkout(): void {
    this.cartService.getUserCart(Number(this.currentUserId)).subscribe(cart => {
      if(cart){
        console.log('Cart from API:', cart);  
        alert('Add cart successfully!');
        this.clearCart();
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems$ = this.cartService.getCartItems();
  }
}
