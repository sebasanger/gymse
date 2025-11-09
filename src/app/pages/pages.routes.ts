import { Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { Pages } from './pages';
import { UsersComponent } from './users/users.component';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { CreateUpdateEjerciciosComponent } from './ejercicios/create-update-ejercicios/create-update-ejercicios.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'ejercicios', component: EjerciciosComponent },
      {
        path: 'ejercicios/create',
        component: CreateUpdateEjerciciosComponent,
      },
      {
        path: 'ejercicios/update/:id',
        component: CreateUpdateEjerciciosComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
