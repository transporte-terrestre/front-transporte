import { Observable, from } from 'rxjs';

/**
 * Convierte una Promesa a un Observable
 * Útil para mantener compatibilidad con código que usa .subscribe()
 * @param promise La promesa a convertir
 * @returns Un Observable que emite el resultado de la promesa
 */
export function toObservable<T>(promise: Promise<T>): Observable<T> {
  return from(promise);
}
