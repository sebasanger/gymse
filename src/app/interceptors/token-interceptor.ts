import type {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import type { Observable } from 'rxjs';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LOCAL_STORAGE } from '../providers/localstorage';

const isRefreshing = new BehaviorSubject<boolean>(false);

export function authenticationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authenticationService = inject(AuthService);
  const storageService = inject(LOCAL_STORAGE);
  const router = inject(Router);

  const clonedRequest = attachAccessToken(request, storageService);
  return handleRequest({
    request: clonedRequest,
    next,
    authenticationService,
    storageService,
    router,
  });
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

function handleRequest(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  return parameters.next(parameters.request).pipe(
    catchError((errorResponse: HttpErrorResponse) =>
      handleErrors({
        errorResponse,
        ...parameters,
      })
    )
  );
}

function handleErrors(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  storageService: Storage | null;
  router: Router;
  errorResponse: HttpErrorResponse;
}): Observable<HttpEvent<unknown>> {
  console.log(parameters);
  if (isAccessTokenError(parameters.errorResponse)) {
    return tryRefreshToken(parameters);
  }

  if (isRefreshTokenError(parameters.errorResponse)) {
    parameters.authenticationService.logout();
    void parameters.router.navigate(['auth/login']);
    return throwError(() => new Error('Session expired. Please log in again.'));
  }

  return throwError(() => parameters.errorResponse);
}

function isAccessTokenError(errorResponse: HttpErrorResponse): boolean {
  console.log('ERROR AL REFRESCAR');

  return false;
  // return (
  //   errorResponse.status === 401 &&
  //   [AppError.ACCESS_TOKEN_NOT_FOUND, AppError.ACCESS_TOKEN_EXPIRED].includes(
  //     errorResponse.error.internalCode
  //   )
  // );
}

function isRefreshTokenError(errorResponse: HttpErrorResponse): boolean {
  console.log('ERROR AL REFRESCAR REFRESH');

  return false;
  // return (
  //   errorResponse.status === 401 &&
  //   [AppError.REFRESH_TOKEN_NOT_FOUND, AppError.REFRESH_TOKEN_EXPIRED].includes(
  //     errorResponse.error.internalCode
  //   )
  // );
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
  isRefreshing.next(true);

  return parameters.authenticationService.refreshToken().pipe(
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
    filter((refreshing) => !refreshing),
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
  const clonedRequest = refreshedToken
    ? parameters.request.clone({
        setHeaders: { Authorization: `Bearer ${refreshedToken}` },
      })
    : parameters.request;
  return parameters.next(clonedRequest);
}

function handleRefreshError(parameters: {
  authenticationService: AuthService;
  router: Router;
}): void {
  parameters.authenticationService.logout();
  void parameters.router.navigate(['auth/login']);
}
