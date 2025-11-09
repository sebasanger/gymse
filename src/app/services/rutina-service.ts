import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { CreateRutinaDto, Rutina, UpdateRutinaDto } from '../interfaces/rutina/rutina.interface';

@Injectable({
  providedIn: 'root',
})
export class RutinaService extends BaseService<Rutina, CreateRutinaDto, UpdateRutinaDto> {
  protected override endpoint: string = 'rutina';
}
