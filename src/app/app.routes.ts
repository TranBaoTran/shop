import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';


export const routes: Routes = [
    {   path: '', 
        component: HomeComponent,
        children: [
            { path: '', component: ProductListComponent },
            { path: 'category/:query', component: ProductListComponent },
            { path: 'product-detail/:id', component: ProductDetailComponent}
        ]},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent}
];

// export const routes: Routes = [
//     { path: '', component: ProductListComponent},
//     { path: 'category/:query', component: ProductListComponent},
//     { path: 'product-detail/:id', component: ProductDetailComponent}
// ];
