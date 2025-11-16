import { Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { Pages } from './pages';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { CreateUpdateEjerciciosComponent } from './ejercicios/create-update-ejercicios/create-update-ejercicios.component';
import { CreateUpdateUsuariosComponent } from './usuarios/create-update-usuarios/create-update-usuarios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RutinasComponent } from './rutinas/rutinas.component';
import { CreateUpdateRutinasComponent } from './rutinas/create-update-rutinas/create-update-rutinas.component';
import { CheckInOutComponent } from './check-in-out/check-in-out.component';
import { SeleccionRutinasComponent } from './rutinas/seleccion-rutina/seleccion-rutina.component';
import { SeguimientoRutina } from './rutinas/seguimiento-rutina/seguimiento-rutina';
import { SuscripcionRutinasComponent } from './rutinas/suscripcion-rutinas/suscripcion-rutinas.component';
import { CreateUpdateOwnRutinasComponent } from './rutinas/create-update-rutinas-own/create-update-rutinas-own.component';

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
      { path: 'rutinas/seleccionar', component: SeleccionRutinasComponent },
      { path: 'rutinas/seguimiento', component: SeguimientoRutina },
      { path: 'rutinas/suscripcion', component: SuscripcionRutinasComponent },
      {
        path: 'rutinas/create',
        component: CreateUpdateRutinasComponent,
      },
      {
        path: 'rutinas/update/:id',
        component: CreateUpdateRutinasComponent,
      },
      {
        path: 'rutinas/create/own',
        component: CreateUpdateOwnRutinasComponent,
      },
      {
        path: 'rutinas/update/own/:id',
        component: CreateUpdateOwnRutinasComponent,
      },

      { path: 'checkInOut', component: CheckInOutComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
