import { Component, signal, inject, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '@service/auth/auth.service';
import { PATH, buildPath } from '@route/path.route';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);

  isOpen = input(false);
  isCollapsed = input(false);
  close = output<void>();

  menuItems = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      path: buildPath(PATH.admin.dashboard),
      icon: 'fas fa-home',
    },

    {
      label: 'Viajes',
      path: buildPath(PATH.admin.viajes),
      icon: 'fas fa-shipping-fast',
    },
    {
      label: 'Mantenimientos',
      path: buildPath(PATH.admin.mantenimientos),
      icon: 'fas fa-tools',
    },
    {
      label: 'Vehículos',
      path: buildPath(PATH.admin.vehiculos),
      icon: 'fas fa-car',
    },
    {
      label: 'Conductores',
      path: buildPath(PATH.admin.conductores),
      icon: 'fas fa-id-card',
    },
    {
      label: 'Talleres',
      path: buildPath(PATH.admin.talleres),
      icon: 'fas fa-building',
    },
    {
      label: 'Rutas',
      path: buildPath(PATH.admin.rutas),
      icon: 'fas fa-route',
    },
    {
      label: 'Clientes',
      path: buildPath(PATH.admin.clientes),
      icon: 'fas fa-user-tie',
    },
    {
      label: 'Propietarios',
      path: buildPath(PATH.admin.propietarios),
      icon: 'fas fa-user-shield',
    },
    {
      label: 'Usuarios',
      path: buildPath(PATH.admin.usuarios),
      icon: 'fas fa-users',
    },
    {
      label: 'Reportes',
      path: buildPath(PATH.admin.reportes),
      icon: 'fas fa-chart-bar',
    },
  ]);

  logout() {
    this.authService.logout();
    this.router.navigate([buildPath(PATH.auth.signIn)]);
  }

  closeSidebar() {
    this.close.emit();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeSidebar();
  }
}
