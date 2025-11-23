import { Injectable } from '@angular/core';
import { Membresia } from '../interfaces/membresia/membresia.interface';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class MembresiaService extends BaseService<Membresia> {
  protected override endpoint: string = 'membresia';
}
