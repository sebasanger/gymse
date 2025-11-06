import { Routes } from '@angular/router';
import { Pages } from './pages/pages';
import { Login } from './auth/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    canActivate: [authGuard],
    path: 'pages',
    component: Pages,
    loadChildren: async () =>
      import('./pages/pages.routes').then((module_) => module_.PAGES_ROUTES),
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
