import { Component, inject, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';
import { NotificacionService } from '@service/admin/notificacion.service';
import { ThemeService } from '@service/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);
  notificationService = inject(NotificacionService);
  themeService = inject(ThemeService);
  isDropdownOpen = signal(false);

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

  onToggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen.set(false);
  }
}
