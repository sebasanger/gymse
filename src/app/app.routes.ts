import { Routes } from '@angular/router';
import { Pages } from './pages/pages';
import { Login } from './auth/login/login';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Pages,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: Login,
  },
];
