import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { RecoverPassword } from './auth/recoverPasswordForm/recoverPasswordForm';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'auth/register',
    component: Register,
  },
  {
    path: 'auth/recoverPassword',
    component: RecoverPassword,
  },
  {
    path: 'pages',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/pages.routes').then((m) => m.PAGES_ROUTES),
  },
  {
    path: '',
    redirectTo: '/pages/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/pages/dashboard',
  },
];
