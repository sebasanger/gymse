import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Ejercicio } from '../interfaces/ejercicio/ejercicio.interface';

@Injectable({
  providedIn: 'root',
})
export class EjercicioService extends BaseService<Ejercicio> {
  protected override endpoint: string = 'ejercicio';
}
