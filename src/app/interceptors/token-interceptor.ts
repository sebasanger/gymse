import type {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import type { Observable } from 'rxjs';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LOCAL_STORAGE } from '../providers/localstorage';
import { isPlatformBrowser } from '@angular/common';

const isRefreshing = new BehaviorSubject<boolean>(false);

export function authenticationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authenticationService = inject(AuthService);
  const storageService = inject(LOCAL_STORAGE);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(request);
  }

  const clonedRequest = attachAccessToken(request, storageService);

  return next(clonedRequest).pipe(
    catchError((errorResponse: HttpErrorResponse) =>
      handleErrors({
        request: clonedRequest,
        next,
        authenticationService,
        storageService,
        router,
        errorResponse,
      })
    )
  );
}

function attachAccessToken(
  request: HttpRequest<unknown>,
  storageService: Storage | null
): HttpRequest<unknown> {
  const accessToken = storageService?.getItem('authenticationToken');
  if (accessToken) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return request;
}

function handleErrors(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  storageService: Storage | null;
  router: Router;
  errorResponse: HttpErrorResponse;
}): Observable<HttpEvent<unknown>> {
  const { errorResponse } = parameters;

  // 401 de access token → intentamos refrescar
  if (isAccessTokenError(errorResponse)) {
    return tryRefreshToken(parameters);
  }

  // 401 en endpoint de refresh → sesión expirada
  if (isRefreshTokenError(errorResponse)) {
    parameters.authenticationService.logout();
    void parameters.router.navigate(['/auth/login']);
    return throwError(() => new Error('Session expired'));
  }

  // cualquier otro error → lo lanzamos
  return throwError(() => errorResponse);
}

// Access token inválido o expirado
function isAccessTokenError(errorResponse: HttpErrorResponse): boolean {
  return errorResponse.status === 401 && !errorResponse.url?.includes('/refresh/token');
}

// Refresh token inválido/expirado
function isRefreshTokenError(errorResponse: HttpErrorResponse): boolean {
  return errorResponse.status === 401 && !!errorResponse.url?.includes('/refresh/token');
}

function tryRefreshToken(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  if (!isRefreshing.getValue()) {
    return handleTokenRefresh(parameters);
  }

  return waitForTokenRefresh(parameters);
}

function handleTokenRefresh(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  const { authenticationService, storageService } = parameters;

  isRefreshing.next(true);

  const refreshToken = storageService?.getItem('refreshToken') ?? '';
  const email = storageService?.getItem('email') ?? '';

  return authenticationService.refreshToken({ email, refreshToken }).pipe(
    switchMap(() => {
      isRefreshing.next(false);
      return retryRequestWithRefreshedToken(parameters);
    }),
    catchError((error: HttpErrorResponse) => {
      isRefreshing.next(false);
      handleRefreshError(parameters);
      return throwError(() => error);
    })
  );
}

function waitForTokenRefresh(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  storageService: Storage | null;
}): Observable<HttpEvent<unknown>> {
  return isRefreshing.pipe(
    filter((value) => !value),
    take(1),
    switchMap(() => retryRequestWithRefreshedToken(parameters))
  );
}

function retryRequestWithRefreshedToken(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  storageService: Storage | null;
}): Observable<HttpEvent<unknown>> {
  const refreshedToken = parameters.storageService?.getItem('authenticationToken');

  const cloned = refreshedToken
    ? parameters.request.clone({
        setHeaders: {
          Authorization: `Bearer ${refreshedToken}`,
        },
      })
    : parameters.request;

  return parameters.next(cloned);
}

function handleRefreshError(parameters: {
  authenticationService: AuthService;
  router: Router;
}): void {
  parameters.authenticationService.logout();
  void parameters.router.navigate(['/auth/login']);
}
