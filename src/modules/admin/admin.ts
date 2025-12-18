import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { Notificaciones } from './layout/notificaciones/notificaciones';

@Component({
  selector: 'app-admin',
  imports: [Navbar, Sidebar, RouterOutlet, Notificaciones],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleCollapse() {
    this.sidebarCollapsed.update((v) => !v);
  }
}
