import { MembresiaUsuarioMin } from '../membresiaUsuario/membresia-usuario.interface';

export interface UsuarioConMembresia {
  id: number;
  deleted: boolean;
  enabled: boolean;
  documento: string;
  email: string;
  fullName: string;
  membresiaActiva?: MembresiaUsuarioMin;
}

export interface CreateClienteDto {
  email: string;
  documento: string;
  fullName: string;
  membresiaId: number | null;
}

export interface UpdateClienteDto {
  id: number;
  email: string;
  documento: string;
  fullName: string;
  membresiaId: number | null;
}
