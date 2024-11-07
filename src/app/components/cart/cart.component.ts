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
  cartItems: CartItem[] = [];
  totalAmount$: Observable<number>;  

  constructor(private cartService: CartService) {
    this.totalAmount$ = this.cartService.totalAmount$;
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
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
    this.cartItems = this.cartService.getCartItems(); // Cập nhật danh sách sau khi xóa
  }

  checkout(): void {
    this.totalAmount$.subscribe(totalAmount => {
      alert('Proceeding to checkout with total amount: ' + totalAmount);
    });
  }
}
