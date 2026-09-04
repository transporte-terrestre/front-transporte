// Usando import.meta.env (Angular 17+ con Vite/esbuild)
const rawBloqued = import.meta.env?.['NG_APP_BLOQUED'];

export const environment = {
  baseUrl: import.meta.env?.['NG_APP_BASE_URL'],
  bloqued: rawBloqued !== undefined ? rawBloqued === 'true' : false,
  production: true,
};



