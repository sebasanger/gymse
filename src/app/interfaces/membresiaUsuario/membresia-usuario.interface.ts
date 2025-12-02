import { Membresia } from '../membresia/membresia.interface';
import { UsuarioMinDto } from '../user/usuario.interface';

export interface MembresiaUsuario {
  id: number;
  usuario: UsuarioMinDto;
  fechaInscripcion: Date;
  fechaVencimiento: Date;
  fechaUltimoPago: Date;
  cantidadDias: number;
  enabled: boolean;
  deleted: boolean;
  pagos?: any;
}

export interface MembresiaActualUsuario {
  id: number;
  usuario: UsuarioMinDto;
  membresia: Membresia;
  fechaInscripcion: Date;
  fechaVencimiento: Date;
  fechaUltimoPago: Date;
  enabled: boolean;
  deleted: boolean;
  pagos?: any;
}

export interface MembresiaUsuarioMin {
  id: number;
  membresiaUsuarioId: number;
  nombre: String;
  fechaInscripcion: Date;
  fechaVencimiento: Date;
  fechaUltimoPago: Date;
  enabled?: boolean;
  deleted?: boolean;
}

export interface MembresiaUsuarioPair {
  membresia: Membresia;
  membresiaUsuario?: MembresiaUsuario;
}
