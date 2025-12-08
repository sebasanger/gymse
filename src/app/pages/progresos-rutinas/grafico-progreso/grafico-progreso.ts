import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-root',
  templateUrl: './grafico-progreso.html',
  styleUrls: ['./grafico-progreso.scss'],
  imports: [NgApexchartsModule, CommonModule],
})
export class GraficoProgreso {
  entrenamientos = [
    {
      nombreEjercicio: 'press banca plano con barra',
      idEjercicio: 1,
      progresos: [
        {
          fecha: '2025-12-07',
          seriesRealizadas: [
            { repeticiones: 8, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 9, peso: 140 },
          ],
        },
        {
          fecha: '2025-12-08',
          seriesRealizadas: [
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 9, peso: 140 },
          ],
        },
        {
          fecha: '2025-12-09',
          seriesRealizadas: [
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 10, peso: 140 },
          ],
        },
        {
          fecha: '2025-12-10',
          seriesRealizadas: [
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 120 },
          ],
        },
        {
          fecha: '2025-12-11',
          seriesRealizadas: [
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 180 },
          ],
        },
      ],
    },
    {
      nombreEjercicio: 'press banca plano con mancuernas',
      idEjercicio: 2,
      progresos: [
        {
          fecha: '2025-12-07',
          seriesRealizadas: [
            { repeticiones: 8, peso: 80 },
            { repeticiones: 10, peso: 60 },
            { repeticiones: 9, peso: 80 },
          ],
        },
        {
          fecha: '2025-12-10',
          seriesRealizadas: [
            { repeticiones: 10, peso: 80 },
            { repeticiones: 10, peso: 60 },
            { repeticiones: 9, peso: 80 },
          ],
        },
      ],
    },
  ];

  chartOptionsPorEjercicio: { [idEjercicio: number]: Partial<ApexOptions> } = {};

  constructor() {
    this.armarGraficos();
  }

  armarSeriesParaEjercicio(ejercicio: any) {
    const pesos = [];
    const reps = [];

    ejercicio.progresos.forEach((progreso: any) => {
      const fecha = progreso.fecha;

      progreso.seriesRealizadas.forEach((serie: any) => {
        pesos.push({ x: fecha, y: serie.peso });
        reps.push({ x: fecha, y: serie.repeticiones });
      });
    });

    return [
      {
        name: 'Peso (kg)',
        type: 'column',
        data: pesos,
        yAxisIndex: 0,
      },
      {
        name: 'Repeticiones',
        type: 'line',
        data: reps,
        yAxisIndex: 1,
      },
    ];
  }

  armarGraficos() {
    this.entrenamientos.forEach((ejercicio) => {
      this.chartOptionsPorEjercicio[ejercicio.idEjercicio] = {
        series: this.armarSeriesParaEjercicio(ejercicio),
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [0, 3],
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: [
          {
            title: { text: 'Peso (kg)' },
          },
          {
            opposite: true,
            title: { text: 'Reps' },
          },
        ],
        title: {
          text: ejercicio.nombreEjercicio,
        },
      };
    });
  }
}
