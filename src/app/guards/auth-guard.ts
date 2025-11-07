import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return of(true);
  }

  if (!authService.getCurrentUser().value) {
    authService.getAuthenticatedUser().subscribe();
    return true;
  }

  if (authService.authState().isLoggedIn) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};
