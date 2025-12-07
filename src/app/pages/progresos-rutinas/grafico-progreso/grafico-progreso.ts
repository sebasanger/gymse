import { Component, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from 'ng-apexcharts';
@Component({
  selector: 'app-grafico-progreso',
  imports: [NgApexchartsModule],
  templateUrl: './grafico-progreso.html',
  styleUrl: './grafico-progreso.scss',
})
export class GraficoProgreso {
  @Input() nombreEjercicio: string = '';
  @Input() seriesRealizadas: { repeticiones: number; peso: number }[] = [];

  // Opciones del grafico
  public chartSeries: ApexAxisChartSeries = [];
  public chartOptions: ApexChart = {
    type: 'line',
    height: 350,
  };
  public xAxis: ApexXAxis = {
    categories: [],
  };
  public stroke: ApexStroke = {
    curve: 'smooth',
  };
  public title: ApexTitleSubtitle = {
    text: '',
  };

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnChanges() {
    this.cargarDatos();
  }

  private cargarDatos() {
    if (!this.seriesRealizadas || this.seriesRealizadas.length === 0) return;

    const pesos = this.seriesRealizadas.map((s) => s.peso);
    const categorias = this.seriesRealizadas.map((_, i) => `Serie ${i + 1}`);

    this.chartSeries = [
      {
        name: 'Peso (kg)',
        data: pesos,
      },
    ];

    this.xAxis = {
      categories: categorias,
    };

    this.title = {
      text: `${this.nombreEjercicio} — Peso por serie`,
    };
  }
}
