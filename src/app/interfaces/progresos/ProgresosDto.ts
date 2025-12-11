import { Serie } from '../serie/serie.interface';

export interface ProgresoRutinaDto {
  rutinaId: number;
  nombreRutina: string;
  progresosEntrenamientos: ProgresoEntrenamientoDto[];
}

export interface ProgresoEntrenamientoDto {
  idEntrenamiento: number;
  nombreEntrenamiento: string;
  progresosEjercicios: ProgresoEjercicioDto[];
}

export interface ProgresoEjercicioDto {
  idEjercicio: number;
  nombreEjercicio: string;
  progresos: ProgresoDto[];
  categoriasX?: any;
}

export interface ProgresoDto {
  fecha: string;
  seriesRealizadas: Serie[];
}
