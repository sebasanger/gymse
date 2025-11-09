import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { authenticationInterceptor } from './interceptors/token-interceptor';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authenticationInterceptor])),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
  ],
};
