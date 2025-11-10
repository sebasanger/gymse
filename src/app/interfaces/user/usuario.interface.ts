import { Role } from '../roles/roles.enum';

export interface Usuario {
  email: string;
  documento: string;
  fullName: string;
  roles: Role[];
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
