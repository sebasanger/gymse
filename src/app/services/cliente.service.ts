import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateClienteDto,
  UpdateClienteDto,
  UsuarioConMembresia,
} from '../interfaces/clientes/cliente.interface';
import { Usuario } from '../interfaces/user/usuario.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  protected endpoint: string = 'cliente';

  protected readonly http = inject(HttpClient);

  findById(id: number): Observable<UsuarioConMembresia> {
    return this.http.get<UsuarioConMembresia>(`${base_url}/${this.endpoint}/${id}`);
  }

  findAllClientes(includedDeleted: boolean): Observable<UsuarioConMembresia[]> {
    return this.http.get<UsuarioConMembresia[]>(
      `${base_url}/${this.endpoint}?includeDeleted=${includedDeleted}`
    );
  }

  saveCliente(createClienteDto: CreateClienteDto): Observable<Usuario> {
    return this.http.post<Usuario>(`${base_url}/${this.endpoint}`, createClienteDto);
  }

  updateCliente(updateClienteDto: UpdateClienteDto): Observable<Usuario> {
    return this.http.put<Usuario>(`${base_url}/${this.endpoint}`, updateClienteDto);
  }
}
