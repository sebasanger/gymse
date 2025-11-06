import { HttpClient } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
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
import { LOCAL_STORAGE } from '../providers/localstorage';

const base_url = environment.base_url;
const client_url = environment.client_url;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  private readonly storageService = inject(LOCAL_STORAGE);

  private readonly authTokens = signal<{ accessToken?: string; refreshToken?: string }>({
    accessToken: this.storageService?.getItem('authenticationToken') ?? undefined,
    refreshToken: this.storageService?.getItem('refreshToken') ?? undefined,
  });

  refreshToken() {
    console.log('Intenta refrescar token');

    return of();
  }

  readonly authState = linkedSignal({
    source: this.authTokens,
    computation: (tokens) => ({
      isLoggedIn: !!tokens.accessToken,
      hasRefreshToken: !!tokens.refreshToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }),
  });

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
    this.storageService?.setItem('authenticationToken', data.authenticationToken);
    this.storageService?.setItem('refreshToken', data.refreshToken);
    this.storageService?.setItem('expiresAt', data.expiresAt.toString());
    this.authTokens.set({
      accessToken: data.authenticationToken,
      refreshToken: data.refreshToken,
    });
  }

  removeDataFromStorage() {
    this.storageService?.removeItem('authenticationToken');
    this.storageService?.removeItem('refreshToken');
    this.storageService?.removeItem('expiresAt');
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
