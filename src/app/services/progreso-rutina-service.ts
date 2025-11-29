import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GuardarRutinaEntrenamiento,
  ProgresoRutina,
  ProgresoRutinaConProgreso,
} from '../interfaces/progresoRutina/progreso-rutina..interface';
import { BaseService } from './base-service';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ProgresoRutinaService extends BaseService<ProgresoRutina> {
  protected override endpoint: string = 'progresoRutina';
  private destroyRef = inject(DestroyRef);
  private readonly $currentUser: BehaviorSubject<ProgresoRutinaConProgreso | null> =
    new BehaviorSubject<ProgresoRutinaConProgreso | null>(null);
  private readonly $activeCustomers: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    super();
    this.updateCountActivas();
  }

  getCurrentRoutine(): BehaviorSubject<ProgresoRutinaConProgreso | null> {
    return this.$currentUser;
  }

  getCurrentActiveCustomers(): BehaviorSubject<number> {
    return this.$activeCustomers;
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
    return this.http
      .put<ProgresoRutina>(
        `${base_url}/${this.endpoint}/guardarRutinaEntrenamiento`,
        guardarRutinaEntrenamiento
      )
      .pipe(
        tap(() => {
          this.getLastActiveRoutine();
        })
      );
  }

  getLastActiveRoutine() {
    this.http
      .get<ProgresoRutinaConProgreso>(`${base_url}/${this.endpoint}/last/active`)
      .subscribe((res) => {
        this.$currentUser.next(res);
      });
  }

  getAllOwnProgressRoutine(): Observable<ProgresoRutinaConProgreso[]> {
    return this.http.get<ProgresoRutinaConProgreso[]>(`${base_url}/${this.endpoint}/own`);
  }

  private updateCountActivas() {
    interval(600000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getCountAndUpdate());
  }

  getCountAndUpdate() {
    this.http.get<number>(`${base_url}/${this.endpoint}/activas/count`).subscribe((res) => {
      this.$activeCustomers.next(res);
    });
  }
}
