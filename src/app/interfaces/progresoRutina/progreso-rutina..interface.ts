import { Entrenamiento } from '../entrenamieto/entrenamiento.interface';
import { Rutina } from '../rutina/rutina.interface';

export interface ProgresoRutina {
  id: number;
  rutina: Rutina;
  entrenamiento: Entrenamiento;
  progresoEjercicio: any;
  fecha: Date;
  checkIn: Date;
  checkOut: Date;
}
