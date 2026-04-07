import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  PLATFORM_ID,
  inject,
  LOCALE_ID,
  Injector,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { registerLocaleData, isPlatformBrowser } from '@angular/common';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { Api, HttpClient } from '@api/backend.api';
import { AuthService } from '@service/auth/auth.service';
import { environment } from '../environments/environment';

import localeEsPE from '@angular/common/locales/es-PE';
import { buildPath, PATH } from '@route/path.route';
registerLocaleData(localeEsPE, 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // agregado
    {
      provide: Api,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const injector = inject(Injector);

        return new Api(
          new HttpClient({
            baseUrl: environment.baseUrl,

            // 1. SECURITY WORKER: Se encarga SOLO de poner el token si existe
            securityWorker: async () => {
              if (isPlatformBrowser(platformId)) {
                const token = localStorage.getItem('accessToken');
                if (token) {
                  return { headers: { Authorization: `Bearer ${token}` } };
                }
              }
              return {};
            },

            // 2. CUSTOM FETCH: Aquí está la magia del interceptor
            customFetch: async (input, init) => {
              // Si estamos en el SERVIDOR (SSR), bloqueamos la petición
              if (!isPlatformBrowser(platformId)) {
                // Retornamos una promesa "falsa" que resuelve nada.
                return Promise.resolve(
                  new Response(JSON.stringify({}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                  }),
                );
              }

              // Si estamos en el NAVEGADOR, hacemos el fetch real
              const response = await fetch(input, init);

              // Detectar error 401 y cerrar sesión solo si es para nuestro backend
              if (response.status === 401) {
                const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
                const backendUrl = environment.baseUrl || '';

                if (url.startsWith(backendUrl)) {
                  // Obtenemos los servicios del inyector de forma perezosa
                  const authService = injector.get(AuthService);
                  const router = injector.get(Router);
                  authService.logout();
                  router.navigate([buildPath(PATH.auth.signIn)]);
                }
              }

              return response;
            },
          }),
        );
      },
    },
  ],
};
