import { Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { Pages } from './pages';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { CreateUpdateEjerciciosComponent } from './ejercicios/create-update-ejercicios/create-update-ejercicios.component';
import { CreateUpdateUsuariosComponent } from './usuarios/create-update-usuarios/create-update-usuarios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RutinasComponent } from './rutinas/rutinas.component';
import { CreateUpdateRutinasComponent } from './rutinas/create-update-ejercicios/create-update-rutinas.component';

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

      { path: 'rutinas', component: RutinasComponent },
      {
        path: 'rutinas/create',
        component: CreateUpdateRutinasComponent,
      },
      {
        path: 'rutinas/update/:id',
        component: CreateUpdateRutinasComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
