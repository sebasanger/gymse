import { Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { Pages } from './pages';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { CreateUpdateEjerciciosComponent } from './ejercicios/create-update-ejercicios/create-update-ejercicios.component';
import { CreateUpdateUsuariosComponent } from './usuarios/create-update-usuarios/create-update-usuarios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      {
        path: 'usuarios/create',
        component: CreateUpdateUsuariosComponent,
      },
      {
        path: 'usuarios/update/:id',
        component: CreateUpdateUsuariosComponent,
      },

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
