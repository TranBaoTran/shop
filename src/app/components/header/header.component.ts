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
  cartItems$: Observable<CartItem[]>;
  totalItems$: Observable<number>;

  // userId: string | null = '';

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router
  ) {
    this.totalItems$ = this.cartService.totalItems$;
    this.cartItems$ = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    this.getCategories();
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  getCategories(){
    this.productService.getCategories().subscribe({
      next: (data: string[]) => {
        if (data) {
          this.categories = data; 
        }
      },
      error: (error) => {
        window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
        console.error('Error:', error);
      },
      complete: () => {
        console.log('getCategories request completed.');
      },
    }); 
  }

  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('cart');
    window.location.reload();
  }

  goToAdminProfile(){
    this.router.navigate(['/admin-profile']);
  }

  // goToAdminProfile(): void {
  //   const userId = localStorage.getItem('userid');
  //   if (userId) {
  //       this.router.navigate(['/admin-profile', userId]);
  //   } else {
  //       //console.error("User ID not found in localStorage");
  //       window.alert("Change Error");
  //   }
  // }
}
