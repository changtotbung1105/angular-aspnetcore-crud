import { Routes } from '@angular/router';
import { TaskList } from './features/task/task-list/task-list';
import { ProductList } from './features/products/product-list/product-list';
import { ProductForm } from './features/products/product-form/product-form';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList },
  { path: 'products', component: ProductList, canActivate: [authGuard]  },
  { path: 'products/new', component: ProductForm , canActivate: [authGuard]  },
  { path: 'products/edit/:id', component: ProductForm, canActivate: [authGuard] },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
];
