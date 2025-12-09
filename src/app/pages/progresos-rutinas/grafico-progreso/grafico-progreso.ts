import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApexOptions, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';

interface SerieRealizada {
  repeticiones: number;
  peso: number;
}

interface Progreso {
  fecha: string;
  seriesRealizadas: SerieRealizada[];
}

interface Entrenamiento {
  nombreEjercicio: string;
  idEjercicio: number;
  progresos: Progreso[];
  categoriasX?: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './grafico-progreso.html',
  styleUrls: ['./grafico-progreso.scss'],
  imports: [NgApexchartsModule, CommonModule],
})
export class GraficoProgreso {
  entrenamientos: Entrenamiento[] = [
    {
      nombreEjercicio: 'press banca plano con barra',
      idEjercicio: 1,
      progresos: [
        {
          fecha: '2025-12-07',
          seriesRealizadas: [
            { repeticiones: 20, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 9, peso: 140 },
          ],
        },
        {
          fecha: '2025-12-08',
          seriesRealizadas: [
            { repeticiones: 10, peso: 140 },
            { repeticiones: 20, peso: 120 },
            { repeticiones: 9, peso: 140 },
          ],
        },
        {
          fecha: '2025-12-09',
          seriesRealizadas: [
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 120 },
            { repeticiones: 20, peso: 140 },
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

  armarSeriesParaEjercicio(ejercicio: Entrenamiento) {
    const dataPorFecha = new Map<string, { pesos: number[]; reps: number[] }>();

    ejercicio.progresos.forEach((progreso: Progreso) => {
      const fecha = progreso.fecha;

      if (!dataPorFecha.has(fecha)) {
        dataPorFecha.set(fecha, { pesos: [], reps: [] });
      }

      progreso.seriesRealizadas.forEach((serie: SerieRealizada) => {
        dataPorFecha.get(fecha)!.pesos.push(serie.peso);
        dataPorFecha.get(fecha)!.reps.push(serie.repeticiones);
      });
    });

    let maxSeries = 0;
    dataPorFecha.forEach((data) => {
      if (data.pesos.length > maxSeries) {
        maxSeries = data.pesos.length;
      }
    });

    const seriesFinales: any[] = [];
    const fechas = Array.from(dataPorFecha.keys()).sort();

    for (let i = 0; i < maxSeries; i++) {
      const datosPesoSerie: { x: string; y: number | null }[] = [];
      const datosRepsSerie: { x: string; y: number | null }[] = [];

      fechas.forEach((fecha) => {
        const datosFecha = dataPorFecha.get(fecha)!;

        const peso = datosFecha.pesos[i] !== undefined ? datosFecha.pesos[i] : 0;
        datosPesoSerie.push({ x: fecha, y: peso });

        const repeticiones = datosFecha.reps[i] !== undefined ? datosFecha.reps[i] : 0;
        datosRepsSerie.push({ x: fecha, y: repeticiones });
      });

      seriesFinales.push({
        name: `Peso S${i + 1} (kg)`,
        type: 'column',
        data: datosPesoSerie,
        yAxisIndex: 0,
      });

      seriesFinales.push({
        name: `Reps S${i + 1}`,
        type: 'line',
        data: datosRepsSerie,
        yAxisIndex: 1,
      });
    }

    ejercicio.categoriasX = fechas;

    return seriesFinales;
  }

  armarGraficos() {
    const newChartOptions: { [idEjercicio: number]: Partial<ApexOptions> } = {};

    this.entrenamientos.forEach((ejercicio) => {
      const series = this.armarSeriesParaEjercicio(ejercicio);
      const categorias = ejercicio.categoriasX || [];

      const yAxisConfig: ApexYAxis[] = series.map((s, index) => {
        const isWeightSeries = index % 2 === 0;

        const isVisible = index < 2;

        let axisOptions: ApexYAxis = {
          opposite: !isWeightSeries,
          show: false,
          axisTicks: { show: false },
          axisBorder: { show: false },
          labels: { show: false },
          title: { text: '' },
          min: 0,
        };

        if (isVisible) {
          axisOptions.show = true;
          axisOptions.axisTicks!.show = true;
          axisOptions.axisBorder!.show = true;

          if (isWeightSeries) {
            axisOptions.title = { text: 'Peso (kg)' };
            axisOptions.opposite = false;
            axisOptions.labels = {
              formatter: (val) => (val === null ? '' : Math.round(val).toString()),
            };
          } else {
            axisOptions.title = { text: 'Reps' };
            axisOptions.opposite = true;
            axisOptions.labels = {
              formatter: (val) => (val === null ? '' : Math.round(val).toString()),
            };
          }
        }

        axisOptions.seriesName = s.name;

        return axisOptions;
      });

      const chartOption: Partial<ApexOptions> = {
        series: series,
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
        },

        xaxis: {
          type: 'category',
          categories: categorias,
          tickPlacement: 'on',
          labels: {
            rotate: -45,
            rotateAlways: true,
            formatter: function (val) {
              if (val) {
                return new Date(val).toLocaleDateString('es-ES', {
                  month: '2-digit',
                  day: '2-digit',
                });
              }
              return '';
            },
            style: {
              fontSize: '10px',
            },
          },
        },
        title: {
          text: ejercicio.nombreEjercicio,
          align: 'left',
          style: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          },
        },

        tooltip: {
          shared: false,
          intersect: false,
          y: {
            formatter: function (val, opts) {
              if (val === null || val === 0) {
                return '';
              }
              const seriesName = opts.w.globals.seriesNames[opts.seriesIndex];

              if (seriesName.includes('Peso')) {
                return val.toFixed(1) + ' kg';
              }
              if (seriesName.includes('Reps')) {
                return Math.round(val).toString() + ' reps';
              }
              return val.toString();
            },
          },
        },

        yaxis: yAxisConfig,
      };

      newChartOptions[ejercicio.idEjercicio] = chartOption;
    });

    this.chartOptionsPorEjercicio = newChartOptions;
  }
}
