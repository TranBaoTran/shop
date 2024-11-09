import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginatorModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

// export class ProductListComponent implements AfterViewInit{
//   @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
//   products: Product[] = []
//   displayedProduct: Product[] = []
//   pageSize = 6;

//   constructor(private productService: ProductService) {}
  
//   ngAfterViewInit() {
//     this.updateDisplayedData();
//     this.paginator.page.subscribe(() => {
//       this.updateDisplayedData();
//     });
//   }

//   updateDisplayedData() {
//     this.productService.getProducts().subscribe(data => {
//       this.products = data;
//       const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
//       this.displayedProduct = this.products.slice(startIndex, startIndex + this.paginator.pageSize);
//     });    
//   }
// }

export class ProductListComponent implements OnInit{
  products: undefined | Product[];
  Math = Math;
  currentUserId: number | null = null;

  constructor(
    private productService: ProductService, 
    private activeRoute: ActivatedRoute, 
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.getProductList();
    });
    this.currentUserId = Number(localStorage.getItem('userid'));
  }

  getProductList(){
    const cate = this.activeRoute.snapshot.paramMap.get('query'); 
    if (cate) {
      this.productService.getProductsByCategory(cate).subscribe(data => {
        if (data) {
          this.products = data; 
        }
      });
    } else {
      this.productService.getProducts().subscribe(data => {
        if (data) {
          this.products = data; 
        }
      });
    }
  }

  goToProductDetail(id : number): void {
    this.router.navigate(['/product-detail', id]);
  }
  
  addToCart(product: Product) {
    this.cartService.addToCart({ 
      productId: product.id, 
      title: product.title, 
      price: product.price, 
      image: product.image,
      quantity: 1 
    });
    console.log(product)
  }

  addCart(product: Product, userId: number | null) : void {
    if (this.currentUserId !== null) {
      this.cartService.addCart({
        productId: product.id,
        date: new Date().toString(),
        quantity: 1,
        userId: this.currentUserId 
      }).subscribe(() => {
        console.log('Product added to User cart:', product);
      });
    } else {
      alert('Please log in to add items to the cart.');
    }
  }
}