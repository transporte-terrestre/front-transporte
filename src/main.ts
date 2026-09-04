import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

if (environment.bloqued && typeof document !== 'undefined') {
  document.title = '';
  document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]').forEach((link) => {
    link.href = 'data:,';
    link.remove();
  });
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

