import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginatorModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements AfterViewInit{
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  products: Product[] = []
  displayedProduct: Product[] = []
  pageSize = 6;

  constructor(private productService: ProductService) {}
  
  ngAfterViewInit() {
    this.updateDisplayedData();
    this.paginator.page.subscribe(() => {
      this.updateDisplayedData();
    });
  }

  updateDisplayedData() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      this.displayedProduct = this.products.slice(startIndex, startIndex + this.paginator.pageSize);
    });    
  }
}
