import { Entrenamiento, EntrenamientoConProgreso } from '../entrenamieto/entrenamiento.interface';
import { ProgresoEjercicio } from '../progresoEjercicio/progreso-ejercicio..interface';
import { Rutina } from '../rutina/rutina.interface';

export interface ProgresoRutina {
  id: number;
  rutina: Rutina;
  entrenamiento: Entrenamiento;
  progresoEjercicio: ProgresoEjercicio[];
  fecha: Date;
  checkIn: Date;
  checkOut: Date;
}

export interface GuardarRutinaEntrenamiento {
  rutinaId: number;
  entrenamientoId: number;
}

export interface ProgresoRutinaActiva {
  id: number;
  rutina: Rutina;
  entrenamientoSeleccionado: EntrenamientoConProgreso;
  fecha: Date;
  checkIn: Date;
  checkOut: Date;
}
