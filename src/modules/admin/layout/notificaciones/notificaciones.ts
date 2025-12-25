import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '@service/admin/notificacion.service';

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class Notificaciones {
  private service = inject(NotificacionService);

  isOpen = this.service.isOpen;
  notificaciones = this.service.notificaciones;

  // Track which notifications are expanded
  expandedIds = signal<Set<number>>(new Set());

  unreadCount = computed(() => this.notificaciones().filter((n) => !n.leido).length);

  close() {
    this.service.close();
  }

  markAsRead(id: number, event: Event) {
    event.stopPropagation();
    this.service.markAsRead(id).subscribe();
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
}
