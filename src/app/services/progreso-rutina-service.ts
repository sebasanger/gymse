import { Injectable } from '@angular/core';
import { ProgresoRutina } from '../interfaces/progresoRutina/progreso-rutina..interface';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ProgresoRutinaService extends BaseService<ProgresoRutina> {
  protected override endpoint: string = 'progresoRutina';

  checkIn(documento: string): Observable<ProgresoRutina> {
    return this.http.post<ProgresoRutina>(`${base_url}/${this.endpoint}/checkIn`, documento);
  }

  checkOut(documento: string): Observable<ProgresoRutina> {
    return this.http.put<ProgresoRutina>(`${base_url}/${this.endpoint}/checkOut`, documento);
  }
}
