import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-root',
  templateUrl: './grafico-progreso.html',
  styleUrls: ['./grafico-progreso.scss'],
  imports: [NgApexchartsModule, CommonModule],
})
export class GraficoProgreso implements OnInit {
  // 🔥 Tu JSON hardcodeado (copiado y simplificado para ejemplo)
  entrenamientos = [
    {
      fecha: '2025-12-07',
      progresoEntrenamiento: {
        progresosEjercicios: [
          {
            nombreEjercicio: 'press banca plano con barra',
            seriesRealizadas: [
              { repeticiones: 8, peso: 140 },
              { repeticiones: 10, peso: 120 },
              { repeticiones: 9, peso: 140 },
              { repeticiones: 10, peso: 140 },
            ],
          },
          {
            nombreEjercicio: 'press inclinado con mancuernas',
            seriesRealizadas: [
              { repeticiones: 9, peso: 100 },
              { repeticiones: 7, peso: 100 },
              { repeticiones: 8, peso: 100 },
              { repeticiones: 8, peso: 100 },
            ],
          },
        ],
      },
    },
    {
      fecha: '2025-12-08',
      progresoEntrenamiento: {
        progresosEjercicios: [
          {
            nombreEjercicio: 'press banca plano con barra',
            seriesRealizadas: [
              { repeticiones: 8, peso: 150 },
              { repeticiones: 7, peso: 150 },
              { repeticiones: 6, peso: 155 },
              { repeticiones: 5, peso: 155 },
            ],
          },
        ],
      },
    },
    {
      fecha: '2025-12-09',
      progresoEntrenamiento: {
        progresosEjercicios: [
          {
            nombreEjercicio: 'press banca plano con barra',
            seriesRealizadas: [
              { repeticiones: 8, peso: 150 },
              { repeticiones: 7, peso: 150 },
              { repeticiones: 6, peso: 155 },
              { repeticiones: 5, peso: 155 },
            ],
          },
        ],
      },
    },
    {
      fecha: '2025-12-10',
      progresoEntrenamiento: {
        progresosEjercicios: [
          {
            nombreEjercicio: 'press banca plano con barra',
            seriesRealizadas: [
              { repeticiones: 10, peso: 220 },
              { repeticiones: 8, peso: 200 },
              { repeticiones: 9, peso: 180 },
              { repeticiones: 5, peso: 190 },
            ],
          },
        ],
      },
    },
  ];

  graficos: Array<{ nombre: string; options: Partial<ApexOptions> }> = [];

  ngOnInit() {
    this.procesarDatos();
  }

  private procesarDatos() {
    const ejerciciosMap = new Map<
      string,
      { fecha: string; pesoTotal: number; repsTotal: number }[]
    >();

    for (const ent of this.entrenamientos) {
      const fecha = ent.fecha;
      for (const ej of ent.progresoEntrenamiento.progresosEjercicios) {
        if (!ejerciciosMap.has(ej.nombreEjercicio)) {
          ejerciciosMap.set(ej.nombreEjercicio, []);
        }
        const pesoTotal = ej.seriesRealizadas.reduce((a, s) => a + s.peso, 0);
        const repsTotal = ej.seriesRealizadas.reduce((a, s) => a + s.repeticiones, 0);

        ejerciciosMap.get(ej.nombreEjercicio)!.push({
          fecha,
          pesoTotal,
          repsTotal,
        });
      }
    }

    ejerciciosMap.forEach((registros, nombreEjercicio) => {
      const fechas = registros.map((r) => r.fecha);
      const pesos = registros.map((r) => r.pesoTotal);
      const reps = registros.map((r) => r.repsTotal);

      this.graficos.push({
        nombre: nombreEjercicio,
        options: {
          series: [
            {
              name: 'Peso total (kg)',
              type: 'column',
              data: pesos,
            },
            {
              name: 'Reps totales',
              type: 'line',
              data: reps,
            },
          ],

          chart: {
            height: 350,
            type: 'line',
            stacked: false,
          },

          dataLabels: { enabled: false },

          stroke: {
            width: [1, 4],
          },

          xaxis: { categories: fechas },

          yaxis: [
            {
              axisTicks: { show: true },
              axisBorder: { show: true, color: '#008FFB' },

              title: { text: 'Peso (kg)', style: { color: '#008FFB' } },
            },
            {
              opposite: true,
              axisTicks: { show: true },
              axisBorder: { show: true, color: '#FEB019' },
              title: { text: 'Repeticiones', style: { color: '#FEB019' } },
            },
          ],

          tooltip: {
            shared: true,
            intersect: false,
          },

          legend: {
            horizontalAlign: 'left',
            offsetX: 40,
          },
        },
      });
    });
  }
}
