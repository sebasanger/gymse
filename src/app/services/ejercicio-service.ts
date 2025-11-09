import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import {
  CreateEjercicio,
  Ejercicio,
  UpdateEjercicio,
} from '../interfaces/ejercicio/ejercicio.interface';

@Injectable({
  providedIn: 'root',
})
export class EjercicioService extends BaseService<Ejercicio, CreateEjercicio, UpdateEjercicio> {
  protected override endpoint: string = 'ejercicio';
}
