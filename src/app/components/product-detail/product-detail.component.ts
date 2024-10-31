import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (history.state && history.state.product) {
      this.product = history.state.product;
    } else {
      const productId = this.route.snapshot.paramMap.get('id');
      // Tải dữ liệu từ server nếu không có trong `state`
    }
  }
}
