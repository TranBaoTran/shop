import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any;

  constructor(private route: ActivatedRoute, private productService : ProductService) {}

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
  
}
