import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  NotificacionCreateDto,
  NotificacionResultDto,
  PaginatedNotificacionResultDto,
  NotificacionPaginationParams,
  NotificacionResultDto as NotificacionDto,
} from '@interface/admin/notificacion.interface';
import { AuthService } from '@service/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private initialized = false;

  // State
  isOpen = signal(false);
  notificaciones = signal<NotificacionDto[]>([]);

  unreadCount = computed(() => this.notificaciones().filter((n) => !n.leido).length);

  constructor() {
    // Auto-load notifications when user is authenticated
    effect(() => {
      const user = this.authService.user();
      if (user && user.id !== undefined && !this.initialized) {
        this.initialized = true;
        this.loadNotificaciones();
      }
      // Reset when user logs out
      if (!user) {
        this.initialized = false;
        this.notificaciones.set([]);
      }
    });
  }

  toggle() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.loadNotificaciones();
    }
  }

  loadNotificaciones() {
    const user = this.authService.user();
    if (!user || user.id === undefined) return;

    this.findAll({ userId: user.id, page: 1, limit: 50 }).subscribe({
      next: (res) => {
        this.notificaciones.set(res.data);
      },
    });
  }

  findAll(params: NotificacionPaginationParams): Observable<PaginatedNotificacionResultDto> {
    return this.http.get<PaginatedNotificacionResultDto>(API_URL.notificaciones.findAll(params));
  }

  create(data: NotificacionCreateDto): Observable<NotificacionResultDto> {
    return this.http.post<NotificacionResultDto>(API_URL.notificaciones.create, data);
  }

  markAsRead(id: number): Observable<any> {
    const user = this.authService.user();
    if (!user || user.id === undefined) throw new Error('User not authenticated');

    return this.http.post<any>(API_URL.notificaciones.leido(id, user.id), {}).pipe(
      tap(() => {
        this.notificaciones.update((list) =>
          list.map((n) => (n.id === id ? { ...n, leido: true } : n))
        );
      })
    );
  }

  markAllAsRead() {
    const unread = this.notificaciones().filter((n) => !n.leido);
    // Simple implementation: mark each as read individually for now since we don't have bulk endpoint
    // In a real app we would want a bulk endpoint
    unread.forEach((n) => this.markAsRead(n.id).subscribe());
  }

  open() {
    this.isOpen.set(true);
    this.loadNotificaciones();
  }

  close() {
    this.isOpen.set(false);
  }
}
