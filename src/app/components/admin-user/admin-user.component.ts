import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MdbCollapseDirective, MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { Cart, Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { MatListModule } from '@angular/material/list';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MdbCollapseModule, MatListModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'fullname', 'username','email', 'phone', 'seeCart', 'del'];
  dataSource!: MatTableDataSource<User>;
  userCart : Cart[] = []
  productMap: Map<number, Product> = new Map();

  resultsLength = 0;
  id = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('basicCollapse') basicCollapse!: MdbCollapseDirective;

  constructor(private userService: UserService, private cartService : CartService, private productService : ProductService) {
    this.dataSource = new MatTableDataSource<User>([]);
  };

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        if (products) {
          products.forEach((product) => this.productMap.set(product.id, product));
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

  ngAfterViewInit(): void {
    this.userService.getAll().subscribe({
      next: (data: User[]) => {
        if (data) {
          this.dataSource.data = data;
          this.resultsLength = data.length;
        }
      },
      error: (error) => {
        window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
        console.error('Error:', error);
      },
      complete: () => {
        console.log('getUsers request completed.');
      },
    }); 

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

  openCollapse(id : number): void {
    if(this.basicCollapse.collapsed){
      this.basicCollapse.collapsed = false;
      this.id = id;
      this.getUserCart(id);
    }else{
      if (id == this.id){
        this.basicCollapse.collapsed = true;  
      }else{
        this.basicCollapse.collapsed = false;  
        this.id = id;
        this.getUserCart(id);
      }
    }
  }

  getUserCart(id : number): void{
    this.cartService.getUserCart(id).subscribe({
      next: (data: Cart[]) => {
        if (data) {
          this.userCart  = data;
        }
      },
      error: (error) => {
        window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
        console.error('Error:', error);
      },
      complete: () => {
        console.log('getUserCart request completed.');
      },
    }); 
  }

  getTotalSum(ucart : Cart): number {
    if (!ucart.products || !this.productMap) {
      return 0;
    }
  
    return ucart.products.reduce((sum, product) => {
      const productDetails = this.productMap.get(product.productId);
      const price = productDetails?.price || 0;
      return sum + price * product.quantity;
    }, 0);  
  }

  deleteUser(id : number): void{
    if(window.confirm('Are you sure you want to delete this user ?')){
      this.userService.deleteUser(id).subscribe({
        next: (data: User) => {
          if (data) {
            this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
          }
        },
        error: (error) => {
          window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
          console.error('Error:', error);
        },
        complete: () => {
          console.log('deleteUser request completed.');
          window.alert("Delete successfully");
        },
      }); 
    }

    
  }
}
