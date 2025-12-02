import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GetUser } from '../interfaces/user/get-user.interface';
import {
  CreateUsuarioClienteDto,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  Usuario,
} from '../interfaces/user/usuario.interface';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/roles/roles.enum';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<Usuario, CreateUsuarioDto, UpdateUsuarioDto, GetUser> {
  protected override endpoint: string = 'user';

  findAllByRol(includedDeleted: boolean, rol: Role[]): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${base_url}/${this.endpoint}?includeDeleted=${includedDeleted}&rol=${rol}`
    );
  }

  saveCliente(createUsuarioClienteDto: CreateUsuarioClienteDto): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${base_url}/${this.endpoint}/createClient`,
      createUsuarioClienteDto
    );
  }
}
