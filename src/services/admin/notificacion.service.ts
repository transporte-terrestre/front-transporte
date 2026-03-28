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
  totalUnreadCount = signal(0); // Total desde el backend
  unreadCount = computed(() => this.notificaciones().filter((n) => !n.leido).length);

  // Pagination state
  currentPage = signal(1);
  hasMore = signal(true);
  isLoadingMore = signal(false);
  private readonly pageSize = 10;
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
      this.currentPage.set(1);
      this.hasMore.set(true);
      const res = await this.findAll({ userId: user.id, page: 1, limit: this.pageSize });
      this.notificaciones.set(res.data);
      this.hasMore.set(res.data.length >= this.pageSize);

      // Calcular total de no leídas desde todas las notificaciones en el backend
      await this.updateTotalUnreadCount(user.id);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private async updateTotalUnreadCount(userId: number) {
    try {
      // Obtener todas las notificaciones iterando a través de las páginas
      let allNotifications: any[] = [];
      let currentPage = 1;
      const pageSize = 100; // Tamaño de página razonable
      let hasMore = true;

      while (hasMore) {
        const res = await this.findAll({ userId, page: currentPage, limit: pageSize });
        allNotifications = [...allNotifications, ...res.data];

        // Verificar si hay más páginas
        hasMore = res.data.length >= pageSize;
        currentPage++;

        // Límite de seguridad para evitar bucles infinitos
        if (currentPage > 100) break;
      }

      const unreadTotal = allNotifications.filter((n) => !n.leido).length;
      this.totalUnreadCount.set(unreadTotal);
    } catch (error) {
      console.error('Error updating total unread count:', error);
      // En caso de error, usar las notificaciones cargadas como fallback
      this.totalUnreadCount.set(this.notificaciones().filter((n) => !n.leido).length);
    }
  }

  async loadMore() {
    const user = this.authService.user();
    if (!user || user.id === undefined || this.isLoadingMore() || !this.hasMore()) return;

    try {
      this.isLoadingMore.set(true);
      const nextPage = this.currentPage() + 1;
      const res = await this.findAll({ userId: user.id, page: nextPage, limit: this.pageSize });

      if (res.data.length > 0) {
        this.notificaciones.update(current => [...current, ...res.data]);
        this.currentPage.set(nextPage);
        this.hasMore.set(res.data.length >= this.pageSize);
      } else {
        this.hasMore.set(false);
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      this.isLoadingMore.set(false);
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
    // Decrementar el contador total si la notificación estaba sin leer
    const notification = this.notificaciones().find(n => n.id === id);
    if (notification && !notification.leido) {
      this.totalUnreadCount.update(count => Math.max(0, count - 1));
    }
    return result;
  }
  async markAllAsRead() {
    const unread = this.notificaciones().filter((n) => !n.leido);
    // Simple implementation: mark each as read individually for now since we don't have bulk endpoint
    // In a real app we would want a bulk endpoint
    await Promise.all(unread.map((n) => this.markAsRead(n.id)));
  }
  async ocultar(id: number) {
    const user = this.authService.user();
    if (!user || user.id === undefined) throw new Error('User not authenticated');

    // Store notification before removing for count update
    const notification = this.notificaciones().find(n => n.id === id);
    if (!notification) return;

    // Optimistic update
    this.notificaciones.update((list) => list.filter((n) => n.id !== id));

    // Update unread count if necessary
    if (!notification.leido) {
      this.totalUnreadCount.update(count => Math.max(0, count - 1));
    }

    try {
      await this.api.notificaciones.markAsDismissed({ id, userId: user.id }, {});
    } catch (error) {
      console.error('Error hiding notification:', error);
      // Fallback: reload notifications on error
      this.loadNotificaciones();
    }
  }
  open() {
    this.isOpen.set(true);
    this.loadNotificaciones();
  }
  close() {
    this.isOpen.set(false);
  }
}
