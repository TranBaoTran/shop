import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any;
  inputQuantity: number = 1;
  currentUserId: number | null = null;

  constructor(private route: ActivatedRoute, private productService : ProductService,
    private cartService: CartService
  ) {
    this.currentUserId = Number(localStorage.getItem('userid'));
  }


  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(){
    this.productService.getProductById(this.route.snapshot.params['id']).subscribe(data => {
      if(data){
        this.product = data;
      }
    })
  } 

    addCart(product: Product, userId: number | null) : void {
      if (this.currentUserId !== null) {
        this.cartService.addCart({
          id: this.currentUserId,
          productId: product.id,
          date: Date.now.toString(),
          quantity: this.inputQuantity,
          userId: this.currentUserId 
        }).subscribe(() => {
          console.log('Product added to User cart:', product);
        });
      } else {
        alert('Please log in to add items to the cart.');
      }
    }
}
