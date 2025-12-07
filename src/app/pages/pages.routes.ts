import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { ProgresosRutinasComponent } from './progresos-rutinas/progresos-rutinas/progresos-rutinas.component';
import { MembresiasComponent } from './membresias/membresias.component';
import { CreateUpdateMembresiasComponent } from './membresias/create-update-membresias/create-update-membresias.component';
import { CreateUpdateClientesComponent } from './clientes/create-update-clientes/create-update-clientes.component';
import { ClientesComponent } from './clientes/clientes.component';
import { GestionMembresiasComponent } from './membresias/gestion-membresia/gestion-membresias.component';
import { PagoMembresiaComponent } from './pago/pago-membresia/pago-membresia';
import { PagosComponent } from './pago/pagos.component';
import { UpdateProfileComponent } from './profile/update-profile/update-clientes.component';
import { UpdatePasswordComponent } from './profile/update-password/update-password.component';
import { GraficoProgreso } from './progresos-rutinas/grafico-progreso/grafico-progreso';
export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      //usuarios
      { path: 'usuarios', component: UsuariosComponent },
      {
        path: 'usuarios/create',
        component: CreateUpdateUsuariosComponent,
      },
      {
        path: 'usuarios/update/:id',
        component: CreateUpdateUsuariosComponent,
      },

      //usuarios
      { path: 'clientes', component: ClientesComponent },
      {
        path: 'clientes/create',
        component: CreateUpdateClientesComponent,
      },
      {
        path: 'clientes/update/:id',
        component: CreateUpdateClientesComponent,
      },

      //ejercicios
      { path: 'ejercicios', component: EjerciciosComponent },
      {
        path: 'ejercicios/create',
        component: CreateUpdateEjerciciosComponent,
      },
      {
        path: 'ejercicios/update/:id',
        component: CreateUpdateEjerciciosComponent,
      },

      //rutinas
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

      //progresos rutinas
      { path: 'progresos/rutinas', component: ProgresosRutinasComponent },

      { path: 'progresos/rutinas/:id', component: GraficoProgreso },

      //membresias
      { path: 'membresias', component: MembresiasComponent },
      {
        path: 'membresias/create',
        component: CreateUpdateMembresiasComponent,
      },
      {
        path: 'membresias/update/:id',
        component: CreateUpdateMembresiasComponent,
      },

      {
        path: 'gestion/membresias',
        component: GestionMembresiasComponent,
      },

      //pagos
      {
        path: 'pago/membresia',
        component: PagoMembresiaComponent,
      },
      {
        path: 'pagos',
        component: PagosComponent,
      },

      //check in
      { path: 'checkInOut', component: CheckInOutComponent },

      //Porfile
      { path: 'profile/update', component: UpdateProfileComponent },
      //password
      { path: 'password/update', component: UpdatePasswordComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
