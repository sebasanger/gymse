import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export abstract class BaseService<
  T extends { id?: number },
  S = T,
  U extends { id?: number } = T,
  G = T
> {
  protected readonly http = inject(HttpClient);
  protected abstract endpoint: string;

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(`${base_url}/${this.endpoint}`);
  }

  findAllIncludingDeleted(): Observable<T[]> {
    return this.http.get<T[]>(`${base_url}/${this.endpoint}/includedDeleted`);
  }

  findById(id: number): Observable<G> {
    return this.http.get<G>(`${base_url}/${this.endpoint}/${id}`);
  }

  save(entity: T): Observable<T> {
    return this.http.post<T>(`${base_url}/${this.endpoint}`, entity);
  }

  saveSpecific(entity: S): Observable<T> {
    return this.http.post<T>(`${base_url}/${this.endpoint}/save`, entity);
  }

  update(entity: T): Observable<T> {
    if (!entity.id) throw new Error('El id es requerido para actualizar');
    return this.http.put<T>(`${base_url}/${this.endpoint}`, entity);
  }

  updateSpecific(entity: U): Observable<T> {
    if (!entity.id) throw new Error('El id es requerido para actualizar');
    return this.http.put<T>(`${base_url}/${this.endpoint}/update`, entity);
  }

  delete(entity: T): Observable<void> {
    if (!entity.id) throw new Error('El id es requerido para eliminar');
    return this.http.delete<void>(`${base_url}/${this.endpoint}/${entity.id}`);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${base_url}/${this.endpoint}/${id}`);
  }

  recoverById(id: number): Observable<void> {
    return this.http.put<void>(`${base_url}/${this.endpoint}/recover/${id}`, null);
  }
}
