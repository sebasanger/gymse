import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Clase, CreateClaseDto, UpdateClaseDto } from '../interfaces/clases/clase.interface';
import { BaseService } from './base-service';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ClaseService extends BaseService<Clase, CreateClaseDto, UpdateClaseDto> {
  protected override endpoint: string = 'clase';
}
