import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import {
  CreateRutinaDto,
  Rutina,
  RutinaConFlag,
  UpdateRutinaDto,
} from '../interfaces/rutina/rutina.interface';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class RutinaService extends BaseService<Rutina, CreateRutinaDto, UpdateRutinaDto> {
  protected override endpoint: string = 'rutina';

  findByUserIr(userId: number): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${base_url}/${this.endpoint}/usuario/${userId}`);
  }

  findByCurrentUser(): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${base_url}/${this.endpoint}/usuario`);
  }

  findWithSuscription(): Observable<RutinaConFlag[]> {
    return this.http.get<RutinaConFlag[]>(`${base_url}/${this.endpoint}/suscripciones`);
  }
}
