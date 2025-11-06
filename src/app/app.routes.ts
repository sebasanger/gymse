import { Routes } from '@angular/router';
import { Pages } from './pages/pages';
import { Login } from './auth/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'pages',
    component: Pages,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
];
