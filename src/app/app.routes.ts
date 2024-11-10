import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { AdminCartComponent } from './components/admin-cart/admin-cart.component';

export const routes: Routes = [
    {   path: '',
        component: HomeComponent,
        children: [
            { path: '', component: ProductListComponent },
            { path: 'cart', component: CartComponent, canActivate: [authGuard] },
            { path: 'category/:query', component: ProductListComponent },
            { path: 'product-detail/:id', component: ProductDetailComponent},
            { path: 'admin-profile', component: AdminProfileComponent, canActivate: [authGuard] }
        ]},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'cart', component: CartComponent },
    { path: 'admin-profile', component: AdminProfileComponent },
    {   path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        children: [
            { path: 'product', component: AdminProductComponent},
            { path: 'user', component: AdminUserComponent},
            { path: 'cart', component: AdminCartComponent}
        ]}
];

