import { Ejercicio } from '../ejercicio/ejercicio.interface';
import { Serie } from '../serie/serie.interface';

export interface ProgresoEjercicio {
  id: number;
  cantidadSeries: number;
  ejericio: Ejercicio;
  series: Serie;
  fecha: Date;
  checkIn: Date;
  checkOut: Date;
}

export interface GuardarProgresoEjercicio {
  ejercicioId: number;
  cantidadSeries: number;
  progresoRutinaId: number;
  series: Serie[];
}
