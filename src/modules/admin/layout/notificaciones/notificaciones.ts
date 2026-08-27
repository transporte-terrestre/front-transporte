import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacionService } from '@service/admin/notificacion.service';
import { AuthService } from '@service/auth/auth.service';
import { Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { ApiResponse } from 'api/backend.api';

type NotificacionDto = ApiResponse<'notificaciones', 'findAll'>['data'][0];

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './notificaciones.html',
})
export class Notificaciones {
  private service = inject(NotificacionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private initialized = false;
  private readonly pageSize = 10;

  // Shared state from service (navbar reads these)
  isOpen = this.service.isOpen;
  totalUnreadCount = this.service.totalUnreadCount;

  // Local state
  notificaciones = signal<NotificacionDto[]>([]);
  expandedIds = signal<Set<number>>(new Set());
  unreadCount = computed(() => this.notificaciones().filter((n) => !n.leido).length);
  currentPage = signal(1);
  hasMore = signal(true);
  isLoadingMore = signal(false);
  isFullscreen = signal(false);
  isBulkActionLoading = signal(false);

  // Filters
  entidadFilter = signal<string>('');
  fechaFilter = signal<string>(''); // format YYYY-MM-DD

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user && user.id !== undefined && !this.initialized) {
        this.initialized = true;
        this.loadNotificaciones();
      }
      if (!user) {
        this.initialized = false;
        this.notificaciones.set([]);
        this.service.totalUnreadCount.set(0);
      }
    });

    effect(() => {
      if (this.isOpen()) {
        this.loadNotificaciones();
      }
    });
  }

  close() {
    this.isFullscreen.set(false);
    this.service.close();
  }

  toggleFullscreen() {
    this.isFullscreen.update((v) => !v);
  }

  applyFilters() {
    this.currentPage.set(1);
    this.hasMore.set(true);
    this.notificaciones.set([]);
    this.loadNotificaciones();
  }

  private buildFilters() {
    const filters: any = {};
    if (this.entidadFilter()) {
      filters.entidad = this.entidadFilter();
    }
    if (this.fechaFilter()) {
      const [year, month, day] = this.fechaFilter().split('-').map(Number);
      const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
      const fin = new Date(year, month - 1, day, 23, 59, 59, 999);
      filters.fechaInicio = inicio.toISOString();
      filters.fechaFin = fin.toISOString();
    }
    return filters;
  }

  async loadNotificaciones() {
    const user = this.authService.user();
    if (!user || user.id === undefined) return;
    try {
      this.currentPage.set(1);
      this.hasMore.set(true);
      const filters = this.buildFilters();
      const res = await this.service.findAll({ page: 1, limit: this.pageSize, ...filters });
      this.notificaciones.set(res.data);
      this.hasMore.set(res.data.length >= this.pageSize);
      await this.updateTotalUnreadCount();
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private async updateTotalUnreadCount() {
    try {
      const filters = this.buildFilters();
      const res = await this.service.countUnread({ ...filters });
      this.service.totalUnreadCount.set(res.count);
    } catch (error) {
      console.error('Error updating total unread count:', error);
      this.service.totalUnreadCount.set(this.notificaciones().filter((n) => !n.leido).length);
    }
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const threshold = 100;
    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;

    if (position >= height - threshold && this.hasMore() && !this.isLoadingMore()) {
      this.loadMore();
    }
  }

  async loadMore() {
    const user = this.authService.user();
    if (!user || user.id === undefined || this.isLoadingMore() || !this.hasMore()) return;

    try {
      this.isLoadingMore.set(true);
      const nextPage = this.currentPage() + 1;
      const filters = this.buildFilters();
      const res = await this.service.findAll({ page: nextPage, limit: this.pageSize, ...filters });

      if (res.data.length > 0) {
        this.notificaciones.update((current) => [...current, ...res.data]);
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

  async markAsRead(id: number, event?: Event) {
    event?.stopPropagation();
    const user = this.authService.user();
    if (!user || user.id === undefined) return;

    const notification = this.notificaciones().find((n) => n.id === id);
    if (notification && !notification.leido) {
      this.service.totalUnreadCount.update((count) => Math.max(0, count - 1));
    }

    await this.service.markAsRead({ id });
    this.notificaciones.update((list) => list.map((n) => (n.id === id ? { ...n, leido: true } : n)));
  }

  async ocultar(id: number, event: Event) {
    event.stopPropagation();
    const user = this.authService.user();
    if (!user || user.id === undefined) return;

    const notification = this.notificaciones().find((n) => n.id === id);
    if (!notification) return;

    // Optimistic update
    this.notificaciones.update((list) => list.filter((n) => n.id !== id));
    if (!notification.leido) {
      this.service.totalUnreadCount.update((count) => Math.max(0, count - 1));
    }

    try {
      await this.service.markAsDismissed({ id });
    } catch (error) {
      console.error('Error hiding notification:', error);
      this.loadNotificaciones();
    }
  }

  async handleNotificationClick(notificacion: any, event: Event) {
    if (!notificacion.leido) {
      await this.markAsRead(notificacion.id);
    }

    if (notificacion.metadata?.entidad && notificacion.metadata?.id) {
      let url = '';
      if (notificacion.metadata.entidad === 'conductor') {
        url = `/${buildPath(PATH.admin.conductores.edit).replace(':id', notificacion.metadata.id)}`;
      } else if (notificacion.metadata.entidad === 'vehiculo') {
        url = `/${buildPath(PATH.admin.vehiculos.edit).replace(':id', notificacion.metadata.id)}`;
      }

      if (url) {
        this.close();
        this.router.navigate([url]);
      }
    }
  }

  async markAllRead() {
    if (this.isBulkActionLoading()) return;

    try {
      this.isBulkActionLoading.set(true);
      await this.service.markAllAsRead();
      await this.loadNotificaciones();
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
    } finally {
      this.isBulkActionLoading.set(false);
    }
  }

  async ocultarTodas() {
    if (this.isBulkActionLoading()) return;
    if (!window.confirm('¿Ocultar todas las notificaciones registradas hasta ahora?')) return;

    try {
      this.isBulkActionLoading.set(true);
      await this.service.dismissAll();
      await this.loadNotificaciones();
    } catch (error) {
      console.error('Error ocultando todas las notificaciones:', error);
    } finally {
      this.isBulkActionLoading.set(false);
    }
  }

  toggleExpand(id: number, event: Event) {
    event.stopPropagation();
    const current = this.expandedIds();
    const newSet = new Set(current);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.expandedIds.set(newSet);
  }

  isExpanded(id: number): boolean {
    return this.expandedIds().has(id);
  }

  hasValidUrl(notificacion: any): boolean {
    const meta = notificacion?.metadata;
    if (meta?.entidad && meta?.id) {
      return meta.entidad === 'conductor' || meta.entidad === 'vehiculo';
    }
    return false;
  }
}
