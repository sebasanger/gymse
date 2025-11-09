import { Categoria } from '../categoria/categoria.interface';
import { Ejercicio } from '../ejercicio/ejercicio.interface';

export interface Entrenamiento {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  categoria: Categoria;
  ejercicios: Ejercicio[];
}

export interface CreateEntrenamientoDto {
  nombre: string;
  descripcion: string;
  categoria: string;
  ejercicios: number[];
}

export interface UpdateEntrenamientoDto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  ejercicios: number[];
}
