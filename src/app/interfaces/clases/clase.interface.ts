import { UsuarioMinDto } from '../user/usuario.interface';

export interface Clase {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  usuario: UsuarioMinDto;
  fechasClases: string;
}

export interface FechaClase {
  id: number;
  fecha: Fecha;
}

export interface Fecha {
  id: number;
  fecha: Date;
}
