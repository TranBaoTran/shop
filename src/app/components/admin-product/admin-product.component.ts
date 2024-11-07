import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseDirective, MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MdbDropdownModule, MdbCollapseModule, FormsModule],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'image', 'category', 'title', 'rate', 'price', 'edit', 'del'];
  data: Product[] = []
  dataSource!: MatTableDataSource<Product>;
  categories:string[] = [];
  product = {
    title: '',
    category: '',
    description: '',
    price: 0,
    image: ''
  };
  editProduct: Product = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0
    }
  };

  resultsLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('basicCollapse') basicCollapse!: MdbCollapseDirective;
  @ViewChild('editCollapse') editCollapse!: MdbCollapseDirective;

  constructor(private productService: ProductService) {
    this.dataSource = new MatTableDataSource<Product>([]);
  };

  ngOnInit() : void{
    this.getCategories();
  }

  ngAfterViewInit(): void {
    this.productService.getProducts().subscribe(data =>{
      if (data){
        this.dataSource.data = data;
        this.resultsLength = data.length;
      }
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCategories(){
    this.productService.getCategories().subscribe(data =>{
      this.categories = data;
    })
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.product.image = reader.result as string; // Assign the file's URL to imageUrl
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }else{
      this.product.image = '';
    }
  }

  onEditChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editProduct.image = reader.result as string; // Assign the file's URL to imageUrl
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }else{
      this.editProduct.image = '';
    }
  }

  addProduct(): void {
    this.productService.addProduct(this.product).subscribe(data => {
      if(data){
        this.dataSource.data = [...this.dataSource.data, data]; 
        this.product = {
          title: '',
          category: '',
          description: '',
          price: 0,
          image: ''
        };
        this.basicCollapse.collapsed = !this.basicCollapse.collapsed;
      }else{
        window.alert("There is something wrong");
      }
    })
  }

  deleteProduct(id : number): void{
    if(window.confirm('Are you sure you want to delete this item ?')){
      this.productService.deleteProduct(id).subscribe(data => {
        if(data){
          this.dataSource.data = this.dataSource.data.filter(product => product.id !== id);
          window.alert("Delete successfully");
        }else{
          window.alert("There is something wrong");
        }
      })  
    }
  }

  openCollapse(product : Product): void {
    if(this.editCollapse.collapsed){
      this.editCollapse.collapsed = false;
      this.editProduct = product;
    }else{
      if (product.id == this.editProduct.id){
        this.editCollapse.collapsed = true;  
      }else{
        this.editCollapse.collapsed = false;  
        this.editProduct = product;
      }
    }
  }

  editProductSubmit(id : number): void{
    if(window.confirm('Are you sure you want to edit this item ?')){
      this.productService.updateProduct(id, this.editProduct).subscribe(data => {
        if(data){
          const index = this.dataSource.data.findIndex(product => product.id === id);
          if (index !== -1) {
            this.dataSource.data[index] = data;
          }
          this.editCollapse.collapsed;
          window.alert("Update successfully");
        }else{
          window.alert("There is something wrong");
        }
      })  
    }
  }
}
