export interface Categoria {
  id: number;
  categoria: string;
  tipo: TipoCaegoria;
}

export type TipoCaegoria = 'ENTRENAMIENTO' | 'EJERCICIO';
