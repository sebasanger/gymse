import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GetUser } from '../interfaces/user/get-user.interface';
import { CreateUsuarioDto, UpdateUsuarioDto, Usuario } from '../interfaces/user/usuario.interface';
import { BaseService } from './base-service';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<Usuario, CreateUsuarioDto, UpdateUsuarioDto, GetUser> {
  protected override endpoint: string = 'user';
}
