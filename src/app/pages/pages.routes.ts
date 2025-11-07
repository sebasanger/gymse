import { Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { Pages } from './pages';
import { UsersComponent } from './users/users.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'users', component: UsersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
