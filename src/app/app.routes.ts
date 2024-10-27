import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent},
    { path: 'category/:query', component: ProductListComponent}
];
