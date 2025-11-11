import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserInfo } from '../user-info/user-info';
import { NavigationItems } from '../../interfaces/navigation/navigation-items';
import { AuthService } from '../../services/auth.service';

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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  public menuItems: Set<NavigationItems> = new Set();

  constructor() {}
  ngOnInit(): void {
    //BASIC ROLE
    this.menuItems = new Set([
      { icon: 'dashboard', redirection: '/pages/dashboard', tittle: 'Inicio' },
    ]);

    //ADMIN ROLES
    this.authService.checkUserHasRole('ADMIN').subscribe((result) => {
      if (result) {
        this.menuItems.add({ icon: 'person', redirection: '/pages/usuarios', tittle: 'Usuarios' });
        this.menuItems.add({
          icon: 'fitness_center',
          redirection: '/pages/ejercicios',
          tittle: 'Ejercicios',
        });
        this.menuItems.add({
          icon: 'run_circle',
          redirection: '/pages/rutinas',
          tittle: 'Rutinas',
        });

        this.menuItems.add({
          icon: 'check_in_out',
          redirection: '/pages/checkInOut',
          tittle: 'Check in/Out',
        });
      }
    });
  }
}
