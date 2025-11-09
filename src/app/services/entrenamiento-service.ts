import { Injectable } from '@angular/core';
import {
  CreateEntrenamientoDto,
  Entrenamiento,
  UpdateEntrenamientoDto,
} from '../interfaces/entrenamieto/entrenamiento.interface';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class EntrenamientoService extends BaseService<
  Entrenamiento,
  CreateEntrenamientoDto,
  UpdateEntrenamientoDto
> {
  protected override endpoint: string = 'entrenamiento';
}
