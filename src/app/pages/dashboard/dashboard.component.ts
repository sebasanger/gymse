import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      const base = [
        {
          title: 'ParadiseBox Oberá',
          cols: 2,
          rows: 1,
          info: `Ubicación: Av. José Ingenieros 290, Oberá`,
          value: '4.5 ★ (según reseñas)',
        },
        {
          title: 'Horarios',
          cols: 1,
          rows: 1,
          info: '6:00 - 22:00 (L a V) / 9:00 - 13:00 (Sáb)',
          value: '',
        },
        {
          title: 'Socios activos (est.)',
          cols: 1,
          rows: 1,
          info: 'Estimado basado en membresías',
          value: '250',
        },
        {
          title: 'Clases disponibles',
          cols: 1,
          rows: 1,
          info: 'Entrenamiento funcional, boxeo, musculación',
          value: '12 tipos',
        },
      ];
      if (matches) {
        // si es mobile, convierte a más cartas individuales
        return base.map((card) => ({ ...card, cols: 1, rows: 1 }));
      }
      return base;
    })
  );
}
