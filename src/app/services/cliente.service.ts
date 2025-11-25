import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioConMembresia } from '../interfaces/user/usuario.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  protected endpoint: string = 'cliente';

  protected readonly http = inject(HttpClient);

  findAllClientes(): Observable<UsuarioConMembresia[]> {
    return this.http.get<UsuarioConMembresia[]>(`${base_url}/${this.endpoint}`);
  }
}
