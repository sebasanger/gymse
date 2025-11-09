import { Injectable } from '@angular/core';
import { Categoria } from '../interfaces/categoria/categoria.interface';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends BaseService<Categoria> {
  protected override endpoint: string = 'categoria';
}
