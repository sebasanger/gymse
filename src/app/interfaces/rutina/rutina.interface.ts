import { CreateEntrenamientoDto, Entrenamiento } from '../entrenamieto/entrenamiento.interface';

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  entrenamientos: Entrenamiento[];
}

export interface CreateRutinaDto {
  nombre: string;
  descripcion: string;
  entrenamientos: CreateEntrenamientoDto[];
  userId?: number;
}

export interface UpdateRutinaDto {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface AddRemoveUserRutine {
  userId: number;
  rutinaId: number;
}
