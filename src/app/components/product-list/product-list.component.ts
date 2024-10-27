import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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

  constructor(private productService: ProductService, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.getProductList();
    });
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
}