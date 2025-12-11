import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

interface Serie {
  id: number;
  repeticiones: number;
  peso: number;
}
interface ProgresoDto {
  fecha: string;
  seriesRealizadas: Serie[];
}
interface ProgresoEjercicioDto {
  idEjercicio: number;
  nombreEjercicio: string;
  progresos: ProgresoDto[];
}
interface ProgresoEntrenamientoDto {
  idEntrenamiento: number;
  nombreEntrenamiento: string;
  progresosEjercicios: ProgresoEjercicioDto[];
}
interface ProgresoRutinaDto {
  rutinaId: number;
  nombreRutina: string;
  progresosEntrenamientos: ProgresoEntrenamientoDto[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './grafico-progreso.html',
  styleUrl: './grafico-progreso.scss',
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
                fecha: '2025-12-15',
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
                ],
              },
              {
                fecha: '2025-12-18',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 150.0,
                  },
                  {
                    id: 7,
                    repeticiones: 7,
                    peso: 200.0,
                  },
                  {
                    id: 5,
                    repeticiones: 8,
                    peso: 230.0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        idEntrenamiento: 1,
        nombreEntrenamiento: 'Entrenamiento de pecho y biceps',
        progresosEjercicios: [
          {
            idEjercicio: 1,
            nombreEjercicio: 'press banca plano con barra',
            progresos: [
              {
                fecha: '2025-12-11',
                seriesRealizadas: [
                  {
                    id: 3,
                    repeticiones: 8,
                    peso: 140.0,
                  },
                  {
                    id: 4,
                    repeticiones: 10,
                    peso: 120.0,
                  },
                  {
                    id: 2,
                    repeticiones: 9,
                    peso: 140.0,
                  },
                  {
                    id: 1,
                    repeticiones: 10,
                    peso: 140.0,
                  },
                ],
              },
            ],
          },
          {
            idEjercicio: 3,
            nombreEjercicio: 'remo con barra',
            progresos: [
              {
                fecha: '2025-12-09',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 100.0,
                  },
                  {
                    id: 9,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                  {
                    id: 7,
                    repeticiones: 7,
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
                fecha: '2025-12-25',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 100.0,
                  },
                  {
                    id: 9,
                    repeticiones: 8,
                    peso: 100.0,
                  },
                  {
                    id: 7,
                    repeticiones: 7,
                    peso: 100.0,
                  },
                  {
                    id: 8,
                    repeticiones: 8,
                    peso: 120.0,
                  },
                ],
              },
              {
                fecha: '2025-12-28',
                seriesRealizadas: [
                  {
                    id: 6,
                    repeticiones: 9,
                    peso: 250.0,
                  },
                  {
                    id: 9,
                    repeticiones: 8,
                    peso: 250.0,
                  },
                  {
                    id: 7,
                    repeticiones: 20,
                    peso: 250.0,
                  },
                  {
                    id: 8,
                    repeticiones: 15,
                    peso: 250.0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // ↓ opciones por ejercicio
  chartPeso: { [idEjercicio: number]: Partial<ApexOptions> } = {};
  chartReps: { [idEjercicio: number]: Partial<ApexOptions> } = {};

  ngOnInit() {
    this.generarGraficos();
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
    this.rutina.progresosEntrenamientos.forEach((entrenamiento) => {
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
}
