import { UsuarioMinDto } from '../user/usuario.interface';

export interface Clase {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  usuario: UsuarioMinDto;
  fechasClases: string[];
}

export interface FechaClase {
  id: number;
  fecha: Fecha;
}

export interface Fecha {
  id: number;
  fecha: Date;
}

export interface CreateClaseDto {
  nombre: string;
  descripcion: string;
  capacidad: number;
  fechas: string[];
}

export interface UpdateClaseDto {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  fechas: string[];
}
