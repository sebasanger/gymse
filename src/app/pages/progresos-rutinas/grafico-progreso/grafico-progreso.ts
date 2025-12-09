import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApexOptions, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';

// --- INTERFACES ---
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

interface DataSeparada {
  seriesPeso: any[];
  seriesReps: any[];
  categorias: string[];
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
            { repeticiones: 25, peso: 250 },
            { repeticiones: 20, peso: 260 },
            { repeticiones: 10, peso: 140 },
            { repeticiones: 10, peso: 180 },
            { repeticiones: 5, peso: 180 },
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
            { repeticiones: 25, peso: 80 },
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
  chartOptionsPesoPorEjercicio: { [idEjercicio: number]: Partial<ApexOptions> } = {};
  chartOptionsRepsPorEjercicio: { [idEjercicio: number]: Partial<ApexOptions> } = {};

  constructor() {
    this.armarGraficos();
  }

  armarSeriesParaEjercicio(ejercicio: Entrenamiento): DataSeparada {
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
      maxSeries = Math.max(maxSeries, data.pesos.length);
    });

    const seriesPesoFinales: any[] = [];
    const seriesRepsFinales: any[] = [];
    const fechas = Array.from(dataPorFecha.keys()).sort();

    for (let i = 0; i < maxSeries; i++) {
      const datosPesoSerie: { x: string; y: number | null }[] = [];
      const datosRepsSerie: { x: string; y: number | null }[] = [];

      fechas.forEach((fecha) => {
        const datosFecha = dataPorFecha.get(fecha)!;

        const peso =
          datosFecha.pesos[i] !== undefined && datosFecha.pesos[i] !== 0
            ? datosFecha.pesos[i]
            : null;
        datosPesoSerie.push({ x: fecha, y: peso });

        const repeticiones =
          datosFecha.reps[i] !== undefined && datosFecha.reps[i] !== 0 ? datosFecha.reps[i] : null;
        datosRepsSerie.push({ x: fecha, y: repeticiones });
      });

      seriesPesoFinales.push({
        name: `Peso S${i + 1} (kg)`,
        type: 'column',
        data: datosPesoSerie,
      });

      seriesRepsFinales.push({
        name: `Reps S${i + 1}`,
        type: 'column',
        data: datosRepsSerie,
      });
    }

    ejercicio.categoriasX = fechas;

    return {
      seriesPeso: seriesPesoFinales,
      seriesReps: seriesRepsFinales,
      categorias: fechas,
    };
  }

  armarGraficos() {
    this.entrenamientos.forEach((ejercicio) => {
      const { seriesPeso, seriesReps, categorias } = this.armarSeriesParaEjercicio(ejercicio);

      const xaxisConfig: Partial<ApexOptions['xaxis']> = {
        type: 'category',
        categories: categorias,
        tickPlacement: 'on',
        labels: {
          rotate: -45,
          rotateAlways: true,
          formatter: (val) =>
            val
              ? new Date(val).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit' })
              : '',
          style: { fontSize: '10px' },
        },
      };

      const yAxisPeso: ApexYAxis[] = [
        {
          opposite: false,
          show: true,
          min: 0,
          axisTicks: { show: true },
          axisBorder: { show: true, color: '#008FFB' },
          title: { text: 'Peso (kg)', style: { color: '#008FFB' } },
          labels: {
            formatter: (val) => (val === null ? '' : Math.round(val).toString()),
            style: { colors: '#008FFB' },
          },
        },
      ];

      const yAxisReps: ApexYAxis[] = [
        {
          opposite: false,
          show: true,
          min: 0,
          axisTicks: { show: true },
          axisBorder: { show: true, color: '#00E396' },
          title: { text: 'Reps', style: { color: '#00E396' } },
          labels: {
            formatter: (val) => (val === null ? '' : Math.round(val).toString()),
            style: { colors: '#00E396' },
          },
        },
      ];

      this.chartOptionsPesoPorEjercicio[ejercicio.idEjercicio] = {
        series: seriesPeso,
        chart: { height: 350, type: 'bar', stacked: false, toolbar: { show: true } },
        plotOptions: { bar: { horizontal: false, columnWidth: '80%' } },
        dataLabels: { enabled: false },
        title: {
          text: ejercicio.nombreEjercicio + ' (Peso)',
          align: 'left',
          style: { fontSize: '18px', fontWeight: '600', color: '#333' },
        },
        tooltip: {
          shared: false,
          intersect: false,
          y: { formatter: (val) => (val === null || val === 0 ? '' : val.toFixed(1) + ' kg') },
        },
        xaxis: xaxisConfig,
        yaxis: yAxisPeso,
      };

      this.chartOptionsRepsPorEjercicio[ejercicio.idEjercicio] = {
        series: seriesReps,
        chart: { height: 350, type: 'bar', stacked: false, toolbar: { show: true } },
        plotOptions: { bar: { horizontal: false, columnWidth: '80%' } },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: ejercicio.nombreEjercicio + ' (Repeticiones)',
          align: 'left',
          style: { fontSize: '18px', fontWeight: '600', color: '#333' },
        },
        tooltip: {
          shared: false,
          intersect: false,
          y: {
            formatter: (val) =>
              val === null || val === 0 ? '' : Math.round(val).toString() + ' reps',
          },
        },
        xaxis: xaxisConfig,
        yaxis: yAxisReps,
      };
    });
  }
}
