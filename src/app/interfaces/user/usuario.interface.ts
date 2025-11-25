import { MembresiaUsuario } from '../membresiaUsuario/membresia-usuario.interface';
import { Rol, Role } from '../roles/roles.enum';

export interface Usuario {
  email: string;
  documento: string;
  fullName: string;
  roles: Rol[];
  id: number;
  avatar?: string;
  createdAt?: Date;
  lastPasswordChangeAt?: Date;
  enabled?: boolean;
  deleted?: boolean;
  username?: string;
}

export interface CreateUsuarioDto {
  email: string;
  documento: string;
  fullName: string;
  roles: Role[];
}

export interface UpdateUsuarioDto {
  id: number;
  email: string;
  documento: string;
  fullName: string;
  roles: Role[];
}

export interface UsuarioMinDto {
  id: number;
  documento: string;
  fullName: string;
}

export interface UsuarioConMembresia {
  id: number;
  deleted: boolean;
  documento: string;
  email: string;
  fullName: string;
  membresiaActiva: MembresiaUsuario;
}
