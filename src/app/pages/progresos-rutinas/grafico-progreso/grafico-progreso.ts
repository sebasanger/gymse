import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import {
  ProgresoEjercicioDto,
  ProgresoRutinaDto,
} from '../../../interfaces/progresos/ProgresosDto';
import { ProgresoRutinaService } from '../../../services/progreso-rutina-service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './grafico-progreso.html',
  styleUrl: './grafico-progreso.scss',
})
export class GraficoProgreso implements OnInit, OnDestroy {
  progresosRutinas: ProgresoRutinaDto | null = null;
  rutinaId: number | null = null;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  chartPeso: { [idEjercicio: number]: Partial<ApexOptions> } = {};
  chartReps: { [idEjercicio: number]: Partial<ApexOptions> } = {};
  private readonly progresoRutinaService = inject(ProgresoRutinaService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.rutinaId = params['id'];
      takeUntil(this.ngUnsubscribe);
      if (!this.rutinaId) {
        return;
      }
      this.progresoRutinaService.getProgresosByRutinaId(this.rutinaId).subscribe((res) => {
        this.progresosRutinas = res;
        this.generarGraficos();
        this.cdr.detectChanges();
      });
    });
  }

  private generarSeries(ejercicio: ProgresoEjercicioDto) {
    const fechas = ejercicio.progresos.map((p) => p.fecha);

    const maxSeries = Math.max(...ejercicio.progresos.map((p) => p.seriesRealizadas.length));

    const seriesPeso = [];
    const seriesReps = [];

    for (let i = 0; i < maxSeries; i++) {
      seriesPeso.push({
        name: `Peso S${i + 1}`,
        type: 'column',
        data: ejercicio.progresos.map((p) => p.seriesRealizadas[i]?.peso ?? null),
      });

      seriesReps.push({
        name: `Reps S${i + 1}`,
        type: 'column',
        data: ejercicio.progresos.map((p) => p.seriesRealizadas[i]?.repeticiones ?? null),
      });
    }

    return { fechas, seriesPeso, seriesReps };
  }

  private generarGraficos() {
    this.progresosRutinas?.progresosEntrenamientos.forEach((entrenamiento) => {
      entrenamiento.progresosEjercicios.forEach((ejercicio) => {
        const { fechas, seriesPeso, seriesReps } = this.generarSeries(ejercicio);

        this.chartPeso[ejercicio.idEjercicio] = {
          series: seriesPeso,
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: fechas },
          title: { text: ejercicio.nombreEjercicio + ' (Peso)' },
        };

        this.chartReps[ejercicio.idEjercicio] = {
          series: seriesReps,
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: fechas },
          title: { text: ejercicio.nombreEjercicio + ' (Repeticiones)' },
        };
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
