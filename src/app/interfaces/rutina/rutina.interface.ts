import { EjercicioEntrenamiento } from '../ejercicioEntrenamiento/ejercicio-entrenamiento.interface';
import { CreateEntrenamientoDto, Entrenamiento } from '../entrenamieto/entrenamiento.interface';
import { UsuarioMinDto } from '../user/usuario.interface';

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  deleted: boolean;
  usuarios: UsuarioMinDto[];
  entrenamientos: EjercicioEntrenamiento[];
}

export interface CreateRutinaDto {
  nombre: string;
  descripcion: string;
  usuariosId?: number[];
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
