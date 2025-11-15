import { Categoria } from '../categoria/categoria.interface';
import {
  EjercicioEntrenamiento,
  EjercicioEntrenamientoDto,
} from '../ejercicioEntrenamiento/ejercicio-entrenamiento.interface';

export interface Entrenamiento {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  categoria: Categoria;
  ejerciciosEntrenamientos: EjercicioEntrenamiento[];
}

export interface CreateEntrenamientoDto {
  nombre: string;
  descripcion: string;
  categoria: string;
  ejercicioEntrenamiento: EjercicioEntrenamientoDto[];
}

export interface UpdateEntrenamientoDto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  ejercicioEntrenamiento: EjercicioEntrenamientoDto[];
}
