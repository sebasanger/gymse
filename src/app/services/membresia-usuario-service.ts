import { Injectable } from '@angular/core';
import {
  MembresiaActualUsuario,
  MembresiaUsuario,
  MembresiaUsuarioPair,
} from '../interfaces/membresiaUsuario/membresia-usuario.interface';
import { BaseService } from './base-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MembresiaUsuarioService extends BaseService<MembresiaUsuario> {
  protected override endpoint: string = 'membresiaUsuario';

  getMembresiaUsuarioByDocument(documento: string): Observable<MembresiaActualUsuario> {
    return this.http.get<MembresiaActualUsuario>(
      `${base_url}/${this.endpoint}/getByDocumento/${documento}`
    );
  }

  getMembresiasByCurrentUser(): Observable<MembresiaUsuarioPair[]> {
    return this.http.get<MembresiaUsuarioPair[]>(`${base_url}/${this.endpoint}/getAllByClient`);
  }
}
