import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ProductListComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  
}
