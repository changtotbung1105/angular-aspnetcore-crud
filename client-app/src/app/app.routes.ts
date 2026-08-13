import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductForm } from './components/product-form/product-form';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
 { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'products', component: ProductList, canActivate: [authGuard] },
  { path: 'products/new', component: ProductForm, canActivate: [authGuard] },
  { path: 'products/edit/:id', component: ProductForm, canActivate: [authGuard] }  
];