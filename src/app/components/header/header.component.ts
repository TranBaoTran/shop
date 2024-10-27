import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MdbDropdownModule, MdbCollapseModule, TitleCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  categories:string[] = [];

  constructor(private productService: ProductService, private router: Router) {};

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.productService.getCategories().subscribe(data =>{
      this.categories = data;
    })
  }

  onCategoryClick(category: string) {
    this.router.navigate([`category/${category}`]); 
  }
}
