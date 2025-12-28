import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';

registerLocaleData(localeEsPE, 'es-PE');

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@interceptor/auth/auth.interceptor';
import { Api, HttpClient as ApiHttpClient } from 'api/backend.api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // agregado
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: Api,
      useFactory: () => {
        return new Api(
          new ApiHttpClient({
            baseUrl: 'http://localhost:3000',
            securityWorker: (securityData) => {
              if (typeof window !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                if (token) {
                  return { headers: { Authorization: `Bearer ${token}` } };
                }
              }
              return Promise.resolve({});
            },
          })
        );
      },
    },
  ],
};
