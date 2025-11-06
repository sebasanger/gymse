import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return of(true);
  }

  return authService.checkUserAuthenticated().pipe(
    tap((isAuth) => {
      if (!isAuth) {
        router.navigateByUrl('/login');
      }
    })
  );
};
