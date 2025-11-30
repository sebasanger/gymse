export interface Pago {
  id: number;
  fecha: Date;
  monto: number;
  transaction: string;
  aceptada: boolean;
  descripcion: string;
}

export interface AddPagoDto {
  membresiaUsuarioId: number;
  transaction: string;
}
