import { Component, inject, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';
import { NotificacionService } from '@service/admin/notificacion.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);
  notificationService = inject(NotificacionService);
  unreadCount = this.notificationService.unreadCount;
  user = this.authService.user;

  userName = computed(() => {
    const u = this.user();
    if (!u) return '';
    const nombre = u.nombres?.split(' ')[0] || '';
    const apellido = u.apellidos?.split(' ')[0] || '';
    return `${nombre} ${apellido}`;
  });

  userRole = computed(() => {
    const u = this.user();
    return u?.roles?.[0] || '';
  });

  userInitials = computed(() => {
    const u = this.user();
    if (!u) return '';
    const n = u.nombres?.charAt(0) || '';
    const a = u.apellidos?.charAt(0) || '';
    return `${n}${a}`.toUpperCase();
  });

  toggleSidebar = output<void>();
  toggleCollapse = output<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleCollapse() {
    this.toggleCollapse.emit();
  }

  onToggleNotifications() {
    this.notificationService.toggle();
  }
}
