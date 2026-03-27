import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '@service/admin/notificacion.service';
import { Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
})
export class Notificaciones {
  private service = inject(NotificacionService);
  private router = inject(Router);

  isOpen = this.service.isOpen;
  notificaciones = this.service.notificaciones;

  // Track which notifications are expanded
  expandedIds = signal<Set<number>>(new Set());

  totalUnreadCount = this.service.totalUnreadCount; // Total desde el backend
  unreadCount = computed(() => this.notificaciones().filter((n) => !n.leido).length);
  hasMore = this.service.hasMore;
  isLoadingMore = this.service.isLoadingMore;

  close() {
    this.service.close();
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const threshold = 100; // pixels from bottom to trigger load
    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;

    if (position >= height - threshold && this.hasMore() && !this.isLoadingMore()) {
      this.service.loadMore();
    }
  }

  async markAsRead(id: number, event: Event) {
    event.stopPropagation();
    await this.service.markAsRead(id);
  }

  async ocultar(id: number, event: Event) {
    event.stopPropagation();
    await this.service.ocultar(id);
  }

  async handleNotificationClick(notificacion: any, event: Event) {

    if (!notificacion.leido) {
      await this.service.markAsRead(notificacion.id);
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

  markAllRead() {
    this.service.markAllAsRead();
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
