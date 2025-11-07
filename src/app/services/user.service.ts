import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserCreateUpdatePayload } from '../interfaces/user/form-user.payload';
import { GetPaginatedUsers } from '../interfaces/user/get-paginated-users';
import { GetUser } from '../interfaces/user/get-user.interface';
import { User } from '../models/user.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(
    filter: string,
    sortDirection: string,
    sort: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get<GetPaginatedUsers>(`${base_url}user/pageable`, {
      params: new HttpParams()
        .set('page', pageIndex.toString())
        .set('filter', filter)
        .set('size', pageSize.toString())
        .set('sort', `${sort},${sortDirection}`),
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${base_url}user`);
  }

  getUserById(userId: number) {
    return this.http.get<GetUser>(`${base_url}user/${userId}`);
  }

  createNewUser(userPayload: UserCreateUpdatePayload): Observable<User> {
    return this.http.post<GetUser>(`${base_url}user`, userPayload);
  }

  updateUser(userPayload: UserCreateUpdatePayload) {
    return this.http.put<GetUser>(`${base_url}user`, userPayload);
  }

  deleteUser(id: number) {
    return this.http.delete(`${base_url}user/${id}`);
  }
}
