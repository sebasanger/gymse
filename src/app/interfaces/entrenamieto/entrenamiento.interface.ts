import { Categoria } from '../categoria/categoria.interface';
import { Ejercicio } from '../ejercicio/ejercicio.interface';
import { EjercicioEntrenamientoDto } from '../ejercicioEntrenamiento/ejercicio-entrenamiento.interface';

export interface Entrenamiento {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  categoria: Categoria;
  ejerciciosEntrenamientos: Ejercicio[];
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
