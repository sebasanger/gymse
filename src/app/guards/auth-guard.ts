import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return of(true);
  }
  const currentUser = authService.getCurrentUser().value;
  if (currentUser) {
    return of(true);
  }

  return authService.getAuthenticatedUser().pipe(
    switchMap((user) => {
      if (user) {
        // si se pudo autenticar al usuario, lo guardamos en el estado y permitimos el acceso
        authService.getCurrentUser().next(user);
        return of(true);
      } else {
        // si no hay usuario, redirigimos al login
        router.navigateByUrl('/auth/login');
        return of(false);
      }
    }),
    catchError(() => {
      // si ocurre un error (por ejemplo token inválido o expirado), también redirigimos
      router.navigateByUrl('/auth/login');
      return of(false);
    })
  );
};
