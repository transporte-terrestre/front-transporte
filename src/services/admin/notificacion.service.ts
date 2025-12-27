import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam, ApiResponse } from 'api/backend.api';
import { AuthService } from '@service/auth/auth.service';
type NotificacionDto = ApiResponse<'notificaciones', 'findAll'>['data'][0];
@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private api = inject(Api);
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

  async loadNotificaciones() {
    const user = this.authService.user();
    if (!user || user.id === undefined) return;
    try {
      const res = await this.findAll({ userId: user.id, page: 1, limit: 50 });
      this.notificaciones.set(res.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }
  async findAll(query: ApiQuery<'notificaciones', 'findAll'>) {
    return await this.api.notificaciones.findAll(query).then((response) => response.data);
  }
  async create(data: ApiBody<'notificaciones', 'create'>) {
    return await this.api.notificaciones.create(data).then((response) => response.data);
  }
  async markAsRead(
    id: ApiParam<'notificaciones', 'markAsRead', 'id'>
  ) {
    const user = this.authService.user();
    if (!user || user.id === undefined) throw new Error('User not authenticated');
    const result = await this.api.notificaciones
      .markAsRead({ id, userId: user.id }, {})
      .then((response) => response.data);
    this.notificaciones.update((list) =>
      list.map((n) => (n.id === id ? { ...n, leido: true } : n))
    );
    return result;
  }
  async markAllAsRead() {
    const unread = this.notificaciones().filter((n) => !n.leido);
    // Simple implementation: mark each as read individually for now since we don't have bulk endpoint
    // In a real app we would want a bulk endpoint
    unread.forEach((n) => this.markAsRead(n.id));
  }
  open() {
    this.isOpen.set(true);
    this.loadNotificaciones();
  }
  close() {
    this.isOpen.set(false);
  }
}