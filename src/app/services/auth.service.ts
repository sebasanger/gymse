import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  linkedSignal,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequestPayload } from '../interfaces/auth/login-request.payload';
import { LoginResponse } from '../interfaces/auth/login-response.payload';
import { ResendEmailVerification } from '../interfaces/auth/resend-email-verification.payload';
import { Role } from '../interfaces/roles/roles.enum';
import { UpdateAcountPayload } from '../interfaces/user/form-update-acount-payload';
import { GetUser } from '../interfaces/user/get-user.interface';
import { User } from '../models/user.model';
import { LOCAL_STORAGE } from '../providers/localstorage';
import { RefreshTokenPayload } from '../interfaces/auth/refresh-token.payload';
import { UpdatePasswordPayolad } from '../interfaces/user/update-password-payload';
import { RecoverPasswordPayolad } from '../interfaces/auth/recover-password-payload';
import { ResetPasswordPayolad } from '../interfaces/auth/reset-password-payload';
import { ValidateAcountPayload } from '../interfaces/auth/validate-acount-payload';

const base_url = environment.base_url;
const client_url = environment.client_url;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageService = inject(LOCAL_STORAGE);
  private readonly userSignal = signal<User | null>(null);
  private readonly $currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  private readonly authTokens = signal<{ accessToken?: string; refreshToken?: string }>({
    accessToken: this.storageService?.getItem('authenticationToken') ?? undefined,
    refreshToken: this.storageService?.getItem('refreshToken') ?? undefined,
  });

  constructor(private httpClient: HttpClient, private router: Router) {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      this.getAuthenticatedUser().subscribe();
    }
  }

  getUser(): WritableSignal<User | null> {
    return this.userSignal;
  }

  getCurrentUser(): BehaviorSubject<User | null> {
    return this.$currentUser;
  }

  refreshToken(refreshTokenPayload: RefreshTokenPayload) {
    return this.httpClient
      .post<LoginResponse>(base_url + '/auth/refresh/token', refreshTokenPayload)
      .pipe(
        map((data: any) => {
          this.setUserDataOnStorageAndRemoveOld(data);
          return data;
        })
      );
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
    return this.httpClient.post<LoginResponse>(base_url + '/auth/login', loginRequestPayload).pipe(
      map((data: any) => {
        this.setUserDataOnStorageAndRemoveOld(data);
        return data;
      })
    );
  }

  resendEmailVerification(resendEmailVerification: ResendEmailVerification) {
    return this.httpClient.put<void>(base_url + '/auth/resend-email', resendEmailVerification);
  }

  setUserDataOnStorageAndRemoveOld(data: LoginResponse) {
    this.removeDataFromStorage();
    this.storageService?.setItem('authenticationToken', data.authenticationToken);
    this.storageService?.setItem('refreshToken', data.refreshToken);
    this.storageService?.setItem('email', data.user.email);
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
    this.storageService?.removeItem('email');
  }

  logout() {
    this.router.navigateByUrl('/auth/login');
    this.removeDataFromStorage();
    this.$currentUser.next(null);
    return of(true);
  }

  getAuthenticatedUser() {
    return this.httpClient.get<User>(base_url + '/auth/me').pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.$currentUser.next(user);
      }),
      catchError(() => {
        this.userSignal.set(null);
        return of(null);
      })
    );
  }

  updateAcount(acountPayload: UpdateAcountPayload) {
    return this.httpClient.put<GetUser>(`${base_url}/user/update-acount`, acountPayload);
  }

  updatePassword(updatePasswordPayolad: UpdatePasswordPayolad) {
    return this.httpClient.put<GetUser>(`${base_url}/user/changePassword`, updatePasswordPayolad);
  }

  recoverPassword(recoverPasswordPayolad: RecoverPasswordPayolad) {
    return this.httpClient.post<GetUser>(`${base_url}/reset-password`, recoverPasswordPayolad);
  }

  resetPassword(resetPasswordPayolad: ResetPasswordPayolad) {
    return this.httpClient.post<boolean>(
      `${base_url}/reset-password/change-password`,
      resetPasswordPayolad
    );
  }

  validateAcount(validateAcountPayload: ValidateAcountPayload) {
    return this.httpClient.put<GetUser>(`${base_url}/auth/validate-acount`, validateAcountPayload);
  }

  checkUserHasRole(rol: Role): Observable<boolean> {
    return this.$currentUser.asObservable().pipe(
      map((user) => {
        return (user?.roles.includes(rol) || user?.roles.includes('ROLE_' + rol)) ?? false;
      })
    );
  }

  checkUserRole(user: User | null, rol: Role): boolean {
    if (!user) {
      return false;
    }
    return (user?.roles.includes(rol) || user?.roles.includes('ROLE_' + rol)) ?? false;
  }
}
