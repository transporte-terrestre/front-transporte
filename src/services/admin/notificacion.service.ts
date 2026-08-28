import { Injectable, inject, signal } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private api = inject(Api);

  // Shared state (navbar + notificaciones panel)
  isOpen = signal(false);
  totalUnreadCount = signal(0);

  toggle() {
    this.isOpen.update((v) => !v);
  }
  open() {
    this.isOpen.set(true);
  }
  close() {
    this.isOpen.set(false);
  }

  // API routing
  async findAll(query: ApiQuery<'notificaciones', 'findAll'>) {
    return await this.api.notificaciones.findAll(query).then((response) => response.data);
  }
  async countUnread(query: ApiQuery<'notificaciones', 'countUnread'>) {
    return await this.api.notificaciones.countUnread(query).then((response) => response.data);
  }
  async create(data: ApiBody<'notificaciones', 'create'>) {
    return await this.api.notificaciones.create(data).then((response) => response.data);
  }
  async markAsRead(params: { id: ApiParam<'notificaciones', 'markAsRead', 'id'> }) {
    return await this.api.notificaciones.markAsRead(params, {}).then((response) => response.data);
  }
  async markAsDismissed(params: { id: number }) {
    return await this.api.notificaciones.markAsDismissed(params, {}).then((response) => response.data);
  }

  async markAllAsRead() {
    return await this.api.notificaciones.markAllAsRead().then((response) => response.data);
  }

  async dismissAll() {
    return await this.api.notificaciones.dismissAll().then((response) => response.data);
  }
}
