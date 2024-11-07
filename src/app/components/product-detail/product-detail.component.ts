import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any;
  inputQuantity: number = 1;

  constructor(private route: ActivatedRoute, private productService : ProductService,
    private cartService: CartService
  ) {}

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
  addToCart(product: Product) {
      if (this.inputQuantity < 1) {
        // Kiểm tra số lượng không hợp lệ
        alert('Số lượng phải lớn hơn hoặc bằng 1');
        return;
      }
      this.cartService.addToCart({ 
        productId: product.id, 
        title: product.title, 
        price: product.price, 
        image: product.image,
        quantity: this.inputQuantity
      });
      console.log('Sản phẩm đã được thêm vào giỏ hàng', product, this.inputQuantity);
    }
}
