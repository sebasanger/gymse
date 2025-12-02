import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPagoDto, Pago } from '../interfaces/pago/pago.interface';
import { environment } from '../../environments/environment';
import { BaseService } from './base-service';
import { MembresiaUsuario } from '../interfaces/membresiaUsuario/membresia-usuario.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class PagoService extends BaseService<Pago> {
  protected override endpoint: string = 'pago';

  getAllByMembresiaUsuarioId(id: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${base_url}/${this.endpoint}/membresiaUsuario/${id}`);
  }

  addPago(addPagoDto: AddPagoDto): Observable<Pago> {
    return this.http.post<Pago>(`${base_url}/${this.endpoint}/add`, addPagoDto);
  }

  deletePago(id: number): Observable<MembresiaUsuario> {
    return this.http.delete<MembresiaUsuario>(`${base_url}/${this.endpoint}/delete/${id}`);
  }
}
