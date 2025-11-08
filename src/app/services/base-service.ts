import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export abstract class BaseService<T extends { id?: number }> {
  protected readonly http = inject(HttpClient);
  protected abstract endpoint: string;

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(`${base_url}/${this.endpoint}`);
  }

  findAllIncludingDeleted(): Observable<T[]> {
    return this.http.get<T[]>(`${base_url}/includeDeleted`);
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${base_url}/${id}`);
  }

  save(entity: T): Observable<T> {
    return this.http.post<T>(base_url, entity);
  }

  saveSpecific(entity: T): Observable<T> {
    return this.http.post<T>(base_url + '/save', entity);
  }

  update(entity: T): Observable<T> {
    if (!entity.id) throw new Error('El id es requerido para actualizar');
    return this.http.put<T>(`${base_url}`, entity);
  }

  updateSpecific(entity: T): Observable<T> {
    if (!entity.id) throw new Error('El id es requerido para actualizar');
    return this.http.put<T>(`${base_url}/update`, entity);
  }

  delete(entity: T): Observable<void> {
    if (!entity.id) throw new Error('El id es requerido para eliminar');
    return this.http.delete<void>(`${base_url}/${entity.id}`);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${base_url}/${id}`);
  }
}
