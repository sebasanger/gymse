import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { map, repeat, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ProgresoRutinaService } from '../../services/progreso-rutina-service';
import { UserInfo } from '../user-info/user-info';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    UserInfo,
    RouterLink,
    RouterModule,
  ],
})
export class NavigationComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private progresoRutinaService = inject(ProgresoRutinaService);
  private cdr = inject(ChangeDetectorRef);
  public totalActivas = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  menuItems = [
    {
      id: 'dashboard',
      icon: 'dashboard',
      redirection: '/pages/dashboard',
      tittle: 'Inicio',
      visible: true,
      default: true,
    },
    {
      id: 'checkin',
      icon: 'how_to_reg',
      redirection: '/pages/checkInOut',
      tittle: 'Check in/Out',
      visible: true,
      default: true,
    },

    // Cliente
    {
      id: 'seleccionar',
      icon: 'check',
      redirection: '/pages/rutinas/seleccionar',
      tittle: 'Seleccionar Rutina',
      visible: false,
    },
    {
      id: 'seguimiento',
      icon: 'track_changes',
      redirection: '/pages/rutinas/seguimiento',
      tittle: 'Seguir Rutina',
      visible: false,
    },
    {
      id: 'suscripcion',
      icon: 'dashboard_customize',
      redirection: '/pages/rutinas/suscripcion',
      tittle: 'Suscripcion Rutina',
      visible: false,
    },
    {
      id: 'progreso',
      icon: 'bar_chart',
      redirection: '/pages/progresos/rutinas',
      tittle: 'Progreso Rutina',
      visible: false,
    },
    {
      id: 'gestion_membresias',
      icon: 'currency_exchange',
      redirection: '/pages/gestion/membresias',
      tittle: 'Gestion Membresias',
      visible: false,
    },
    {
      id: 'pago_membresia',
      icon: 'payment_arrow_down',
      redirection: '/pages/pago/membresia',
      tittle: 'Pagar Membresia',
      visible: false,
    },

    // Admin
    {
      id: 'usuarios',
      icon: 'support_agent',
      redirection: '/pages/usuarios',
      tittle: 'Personal',
      visible: false,
    },
    {
      id: 'clientes',
      icon: 'person',
      redirection: '/pages/clientes',
      tittle: 'Clientes',
      visible: false,
    },
    {
      id: 'ejercicios',
      icon: 'fitness_center',
      redirection: '/pages/ejercicios',
      tittle: 'Ejercicios',
      visible: false,
    },
    {
      id: 'rutinas',
      icon: 'run_circle',
      redirection: '/pages/rutinas',
      tittle: 'Rutinas',
      visible: false,
    },
    {
      id: 'membresias',
      icon: 'currency_exchange',
      redirection: '/pages/membresias',
      tittle: 'Membresias',
      visible: false,
    },
  ];

  constructor() {}
  ngOnInit(): void {
    this.progresoRutinaService.getCurrentActiveCustomers().subscribe((res) => {
      this.totalActivas = res;
    });

    this.progresoRutinaService.getLastActiveRoutine();

    this.authService
      .getCurrentUser()
      .asObservable()
      .subscribe((user) => {
        this.resetMenuVisibility();
        if (this.authService.checkUserRole(user, 'CLIENTE')) {
          this.activateClientMenu();
        }
        if (this.authService.checkUserRole(user, 'ADMIN')) {
          this.activateAdminMenu();
        }
      });
  }

  activateClientMenu() {
    this.setVisible(['gestion_membresias'], true);
    this.setVisible(['pago_membresia'], true);
    this.progresoRutinaService
      .getCurrentRoutine()
      .asObservable()
      .subscribe((res) => {
        //no se tiene check in, o progreso rutina
        this.setVisible(['suscripcion'], true);
        this.setVisible(['progreso'], true);

        if (!res) {
          this.setVisible(['seleccionar'], false);
          this.setVisible(['seguimiento'], false);
        }

        //no se tiene entrenamiento seleccionado
        if (res?.entrenamientoSeleccionado) {
          this.setVisible(['seleccionar'], false);
          this.setVisible(['seguimiento'], true);
        }

        //se selecciono el entrenamiento
        if (res && !res?.entrenamientoSeleccionado) {
          this.setVisible(['seleccionar'], true);
          this.setVisible(['seguimiento'], false);
        }

        this.cdr.detectChanges();
      });
  }

  activateAdminMenu() {
    this.setVisible(['usuarios', 'ejercicios', 'rutinas', 'membresias', 'clientes'], true);
  }

  setVisible(ids: string[], value: boolean) {
    ids.forEach((id) => {
      const item = this.menuItems.find((m) => m.id === id);
      if (item) item.visible = value;
    });
  }

  resetMenuVisibility() {
    this.menuItems.forEach((menuItem) => {
      menuItem.visible = false;
    });
  }
}
