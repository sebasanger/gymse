export type Role = 'CLIENTE' | 'ADMIN' | 'GIMNASIO' | 'ENTRENADOR' | 'INSTRUCTOR' | 'RECEPCIONSITA';

export const ROLES: Role[] = [
  'CLIENTE',
  'ADMIN',
  'GIMNASIO',
  'ENTRENADOR',
  'INSTRUCTOR',
  'RECEPCIONSITA',
];

export const ROLES_PERSONAL: Role[] = [
  'ADMIN',
  'GIMNASIO',
  'ENTRENADOR',
  'INSTRUCTOR',
  'RECEPCIONSITA',
];

export interface Rol {
  id: number;
  rol: Role;
}
