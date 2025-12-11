import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { ProgresoEntrenamientoDto } from '../../../interfaces/progresos/ProgresosDto';

interface ProgresoRutinaDto {
  rutinaId: number;
  nombreRutina: string;
  progresosEntrenamientos: ProgresoEntrenamientoDto[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './grafico-progreso.html',
})
export class GraficoProgreso {
  rutina: ProgresoRutinaDto = {
    rutinaId: 1,
    nombreRutina: 'Rutina para seba Avanzada',
    progresosEntrenamientos: [
      {
        idEntrenamiento: 2,
        nombreEntrenamiento: 'Entrenamiento de espalda y triceps',
        progresosEjercicios: [
          {
            idEjercicio: 2,
            nombreEjercicio: 'press inclinado con mancuernas',
            progresos: [
              {
                fecha: '2025-12-10',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 100.0,
                  },
                  {
                    id: 7,
                    repeticiones: 7,
                    peso: 100.0,
                  },
                  {
                    id: 5,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                  {
                    id: 8,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                ],
              },
              {
                fecha: '2025-12-11',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 100.0,
                  },
                  {
                    id: 7,
                    repeticiones: 7,
                    peso: 100.0,
                  },
                  {
                    id: 5,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                  {
                    id: 8,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                ],
              },
              {
                fecha: '2025-12-16',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 100.0,
                  },
                  {
                    id: 7,
                    repeticiones: 7,
                    peso: 100.0,
                  },
                  {
                    id: 5,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                  {
                    id: 8,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  chartOptionsPeso: any = {};
  chartOptionsReps: any = {};

  ngOnInit() {
    this.generarGraficos();
  }

  generarGraficos() {
    const ejer = this.rutina.progresosEntrenamientos[0].progresosEjercicios[0];

    const fechas = ejer.progresos.map((p) => p.fecha);
    const maxSeries = Math.max(...ejer.progresos.map((p) => p.seriesRealizadas.length));

    const seriesPeso: any[] = [];
    const seriesReps: any[] = [];

    for (let i = 0; i < maxSeries; i++) {
      seriesPeso.push({
        name: `Peso S${i + 1}`,
        data: ejer.progresos.map((p) => p.seriesRealizadas[i]?.peso ?? null),
      });

      seriesReps.push({
        name: `Reps S${i + 1}`,
        data: ejer.progresos.map((p) => p.seriesRealizadas[i]?.repeticiones ?? null),
      });
    }

    this.chartOptionsPeso = {
      series: seriesPeso,
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: fechas },
      title: { text: ejer.nombreEjercicio + ' (Peso)' },
    };

    this.chartOptionsReps = {
      series: seriesReps,
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: fechas },
      title: { text: ejer.nombreEjercicio + ' (Repeticiones)' },
    };
  }
}
