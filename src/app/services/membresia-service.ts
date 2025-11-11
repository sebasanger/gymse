import { Injectable } from '@angular/core';
import { Categoria } from '../interfaces/categoria/categoria.interface';
import { BaseService } from './base-service';
import { Membresia } from '../interfaces/membresia/membresia.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends BaseService<Membresia> {
  protected override endpoint: string = 'membresia';
}
