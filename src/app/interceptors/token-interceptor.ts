import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const jwtToken = authService.getJwtToken();

  const cloned = jwtToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${jwtToken}` } })
    : req;

  return next(cloned);
};
