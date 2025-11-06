import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequestPayload } from '../interfaces/auth/login-request.payload';
import { LoginResponse } from '../interfaces/auth/login-response.payload';
import { ResendEmailVerification } from '../interfaces/auth/resend-email-verification.payload';
import { UpdateAcountPayload } from '../interfaces/user/form-update-acount-payload';
import { GetUserAuthenticated } from '../interfaces/user/get-user-authenticated';
import { GetUser } from '../interfaces/user/get-user.interface';
import { User } from '../models/user.model';

const base_url = environment.base_url;
const client_url = environment.client_url;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  getJwtToken() {
    return 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIxIiwiaWF0IjoxNzYyNDE3NzIzLCJleHAiOjE3NjI1MDQxMjMsImZ1bGxuYW1lIjoiU2ViYXN0aWFuIFNhbmdlcm1hbm8iLCJlbWFpbCI6InNlYmFfc2FuZ2VyQGhvdG1haWwuY29tIiwicm9sZXMiOlsiQURNSU4iXX0.LYmXjfaciV9b0wDCw3Pg-gs184d1Pm0MlukSZJf3y5g';
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(base_url + 'auth/login', loginRequestPayload).pipe(
      map((data: any) => {
        this.setUserDataOnStorageAndRemoveOld(data);
        return data;
      })
    );
  }

  resendEmailVerification(resendEmailVerification: ResendEmailVerification) {
    resendEmailVerification.urlRedirect = client_url + 'auth/activate-acount?tokenuid=';
    return this.httpClient.put<LoginResponse>(
      base_url + 'auth/resend-email',
      resendEmailVerification
    );
  }

  setUserDataOnStorageAndRemoveOld(data: LoginResponse) {
    this.removeDataFromStorage();
    localStorage.setItem('authenticationToken', data.authenticationToken);
    localStorage.setItem('expiresAt', data.expiresAt.toString());
  }

  removeDataFromStorage() {
    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('expiresAt');
  }

  logout() {
    this.router.navigateByUrl('auth/login');
    this.removeDataFromStorage();
    return of(true);
  }

  getAuthenticatedUser() {
    return this.httpClient.get<User>(base_url + 'auth/me');
  }

  checkUserAuthenticated(): Observable<boolean> {
    return this.httpClient.get<GetUserAuthenticated>(`${base_url}auth/me`).pipe(
      map((data) => !!data), // convierte a true/false directamente
      catchError((error) => {
        console.error('Error en checkUserAuthenticated:', error);
        return of(false);
      })
    );
  }

  updateAcount(acountPayload: UpdateAcountPayload) {
    return this.httpClient.put<GetUser>(`${base_url}user/update-acount`, acountPayload);
  }

  checkUserIsAdmin() {
    return this.httpClient.get<GetUserAuthenticated>(base_url + 'auth/me').pipe(
      map((data: any) => {
        if (data != null && data.roles.includes('ADMIN')) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
