import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pago } from '../interfaces/pago/pago.interface';
import { environment } from '../../environments/environment';
import { BaseService } from './base-service';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class PagoService extends BaseService<Pago> {
  protected override endpoint: string = 'pago';

  getAllByMembresiaUsuarioId(id: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${base_url}/${this.endpoint}/membresiaUsuario/${id}`);
  }
}
