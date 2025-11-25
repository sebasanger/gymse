import { Membresia } from '../membresia/membresia.interface';
import { Usuario, UsuarioMinDto } from '../user/usuario.interface';

export interface MembresiaUsuario {
  id: number;
  usuario: Usuario;
  membresia: Membresia;
  fechaInscripcion: Date;
  fechaVencimiento: Date;
  fechaUltimoPago: Date;
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
  enabled: boolean;
  deleted: boolean;
  pagos?: any;
}
