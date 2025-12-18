import { Component, inject, computed } from '@angular/core';
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
}
