import { EjercicioEntrenamiento } from '../ejercicioEntrenamiento/ejercicio-entrenamiento.interface';
import { CreateEntrenamientoDto, Entrenamiento } from '../entrenamieto/entrenamiento.interface';

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  entrenamientos: EjercicioEntrenamiento[];
}

export interface CreateRutinaDto {
  nombre: string;
  descripcion: string;
  userId?: number;
  entrenamientos: CreateEntrenamientoDto[];
}

export interface UpdateRutinaDto {
  id: number;
  nombre: string;
  descripcion: string;
  userId?: number;
  entrenamientos: CreateEntrenamientoDto[];
}

export interface AddRemoveUserRutine {
  userId: number;
  rutinaId: number;
}
