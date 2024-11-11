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
    const storedUserId = localStorage.getItem('userid');
    this.currentUserId = storedUserId ? Number(storedUserId) : null;
  }

  getProductList(){
    const cate = this.activeRoute.snapshot.paramMap.get('query'); 
    if (cate) {
      this.productService.getProductsByCategory(cate).subscribe({
        next: (data: Product[]) => {
          if (data) {
            this.products = data; 
          }
        },
        error: (error) => {
          window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
          console.error('Error:', error);
        },
        complete: () => {
          console.log('getProductByCategory request completed.');
        },
      });  
    } else {
      this.productService.getProducts().subscribe({
        next: (data: Product[]) => {
          if (data) {
            this.products = data; 
          }
        },
        error: (error) => {
          window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
          console.error('Error:', error);
        },
        complete: () => {
          console.log('getProducts request completed.');
        },
      });  
    }
  }

  goToProductDetail(id : number): void {
    this.router.navigate(['/product-detail', id]);
  }
  
  addCart(product: Product, userId: number | null) : void {
    if (this.currentUserId != null) {
      this.cartService.addCart({
        id: this.currentUserId,
        productId: product.id,
        date: Date.now.toString(),
        quantity: 1,
        userId: this.currentUserId 
      }).subscribe(() => {
        console.log('Product added to User cart:', product);
      });
    } else {
      this.router.navigate(['login']);
    }
  }
}