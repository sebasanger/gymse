import { Injectable } from '@angular/core';
import {
  GuardarRutinaEntrenamiento,
  ProgresoRutina,
  ProgresoRutinaActiva,
} from '../interfaces/progresoRutina/progreso-rutina..interface';
import { BaseService } from './base-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { subscribe } from 'diagnostics_channel';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ProgresoRutinaService extends BaseService<ProgresoRutina> {
  protected override endpoint: string = 'progresoRutina';
  private readonly $currentUser: BehaviorSubject<ProgresoRutinaActiva | null> =
    new BehaviorSubject<ProgresoRutinaActiva | null>(null);

  getCurrentRoutine(): BehaviorSubject<ProgresoRutinaActiva | null> {
    return this.$currentUser;
  }

  checkIn(documento: string): Observable<ProgresoRutina> {
    return this.http.post<ProgresoRutina>(`${base_url}/${this.endpoint}/checkIn`, documento);
  }

  checkOut(documento: string): Observable<ProgresoRutina> {
    return this.http.put<ProgresoRutina>(`${base_url}/${this.endpoint}/checkOut`, documento);
  }

  guardarRutinaEntrenamiento(
    guardarRutinaEntrenamiento: GuardarRutinaEntrenamiento
  ): Observable<ProgresoRutina> {
    return this.http.put<ProgresoRutina>(
      `${base_url}/${this.endpoint}/guardarRutinaEntrenamiento`,
      guardarRutinaEntrenamiento
    );
  }

  getLastActiveRoutine(): Observable<ProgresoRutinaActiva> {
    return this.http.get<ProgresoRutinaActiva>(`${base_url}/${this.endpoint}/last/active`).pipe(
      tap((res) => {
        this.$currentUser.next(res);
      })
    );
  }

  getLastActiveRoutineDos() {
    this.http
      .get<ProgresoRutinaActiva>(`${base_url}/${this.endpoint}/last/active`)
      .subscribe((res) => {
        this.$currentUser.next(res);
      });
  }
}
