import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { AdminProductComponent } from './components/admin-product/admin-product.component';

export const routes: Routes = [
    {   path: '', 
        component: HomeComponent,
        children: [
            { path: '', component: ProductListComponent },
            { path: 'category/:query', component: ProductListComponent }
        ]},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    {   path: 'admin', 
        component: AdminComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'product', component: AdminProductComponent}
        ]}
];
