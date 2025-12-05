import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { RecoverPassword } from './auth/recoverPasswordForm/recoverPasswordForm';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
import { ResetPassword } from './auth/resetPasswordForm/resetPasswordForm';
import { ValidateAcount } from './auth/validateAcount/validateAcount';

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
    path: 'auth/reset-password/:tokenuid',
    component: ResetPassword,
  },
  {
    path: 'auth/activate-acount/:tokenuid',
    component: ValidateAcount,
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
