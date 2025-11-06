import { Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { Pages } from './pages';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'pages', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
