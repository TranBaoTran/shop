import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
    {   path: '', 
        component: HomeComponent,
        children: [
            { path: '', component: ProductListComponent },
            { path: 'category/:query', component: ProductListComponent },
            { path: 'product-detail/:id', component: ProductDetailComponent}
        ]},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'cart', component: CartComponent },
];
