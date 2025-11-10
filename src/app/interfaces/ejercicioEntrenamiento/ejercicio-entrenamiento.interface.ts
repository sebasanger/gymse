import { Ejercicio } from '../ejercicio/ejercicio.interface';

export interface EjercicioEntrenamiento {
  id: number;
  series: number;
  repeticiones: number;
  peso: number;
  ejerciciosAlternativos: Ejercicio[];
  ejercicio: Ejercicio;
}
