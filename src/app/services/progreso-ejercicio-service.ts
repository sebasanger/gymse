import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  GuardarProgresoEjercicio,
  ProgresoEjercicio,
} from '../interfaces/progresoEjercicio/progreso-ejercicio..interface';
import { BaseService } from './base-service';
import { UpdateEntrenamientoDto } from '../interfaces/entrenamieto/entrenamiento.interface';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ProgresoEjercicioService extends BaseService<
  ProgresoEjercicio,
  GuardarProgresoEjercicio,
  UpdateEntrenamientoDto
> {
  protected override endpoint: string = 'progresoEjercicio';
}
