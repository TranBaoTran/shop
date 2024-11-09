import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Cart, Product } from '../../models/product.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MdbCollapseDirective, MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-cart',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, MatIconModule, MatTableModule, MatSortModule, MdbCollapseModule, MatButtonModule, CommonModule],
  templateUrl: './admin-cart.component.html',
  styleUrl: './admin-cart.component.css'
})
export class AdminCartComponent implements AfterViewInit {
  readonly range = new FormGroup({
    startdate: new FormControl<Date | null>(null),
    enddate: new FormControl<Date | null>(null),
  });
  dataSource!: MatTableDataSource<Cart>;
  productMap: Map<number, Product> = new Map();
  userMap: Map<number, User> = new Map();
  resultsLength = 0;
  ucart: Cart = {
    id: 0,
    userId: 0,
    date: '',
    products: []
  };
  displayedColumns: string[] = ['id', 'username', 'date', 'total',  'seeCart'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('basicCollapse') basicCollapse!: MdbCollapseDirective;

  constructor(private userService: UserService, private cartService : CartService, private productService : ProductService) {
    this.dataSource = new MatTableDataSource<Cart>([]);

    this.range.valueChanges.subscribe(value => {
      const start = value.startdate?.toISOString().split('T')[0];
      const end = value.enddate?.toISOString().split('T')[0];

      if (start && end) {
        this.getCartData(start, end);
      }
    });
  };

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      products.forEach((product) => this.productMap.set(product.id, product));
    });

    this.userService.getAll().subscribe((users: User[]) => {
      users.forEach((user) => this.userMap.set(user.id, user));
    });
  }

  ngAfterViewInit(): void {
    this.cartService.getAll().subscribe(data =>{
      if (data){
        this.dataSource.data = data;
        this.resultsLength = data.length;
      }
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openCollapse(cart : Cart): void{
    if(this.basicCollapse.collapsed){
      this.basicCollapse.collapsed = false;
      this.ucart = cart;
    }else{
      if (cart.id == this.ucart.id){
        this.basicCollapse.collapsed = true;  
      }else{
        this.basicCollapse.collapsed = false;  
        this.ucart = cart;
      }
    }
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

  getCartData(start: string, end: string): void{
    this.cartService.getByDateRange(start, end).subscribe(data => {
      if(data){
        this.dataSource.data = data;
      }
    })
  }
}
