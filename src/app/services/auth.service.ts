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

  refreshToken() {
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
    return this.httpClient.get<User>(base_url + 'auth/me').pipe(
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
    return this.httpClient.put<GetUser>(`${base_url}user/update-acount`, acountPayload);
  }

  checkUserHasRole(rol: Role): boolean {
    return this.$currentUser.value?.roles?.includes(rol) ?? false;
  }
}
