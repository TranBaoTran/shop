import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MdbDropdownModule, MdbCollapseModule, TitleCasePipe, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  categories:string[] = [];
  isLoggedIn!: boolean;
  // cart
  cartItems$: Observable<CartItem[]> = new Observable<CartItem[]>();
  totalItems$: Observable<number>= new Observable<number>();  

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService
  ) {
    // khoi tao so luong, cart
    this.totalItems$ = this.cartService.totalItems$;
    this.cartItems$ = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    this.getCategories();
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  getCategories(){
    this.productService.getCategories().subscribe(data =>{
      this.categories = data;
    })
  }

  logOut(){
    localStorage.removeItem('token');
    window.location.reload();
  }
}
