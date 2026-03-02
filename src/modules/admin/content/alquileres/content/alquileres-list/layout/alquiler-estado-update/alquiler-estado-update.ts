import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-alquiler-estado-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alquiler-estado-update.html',
  styleUrl: './alquiler-estado-update.css',
})
export class AlquilerEstadoUpdate {
  private alquilerService = inject(AlquilerService);
  private toastService = inject(ToastService);

  alquilerId = input.required<number>();
  estadoActual = input.required<string>();

  onStatusUpdated = output<void>();

  loading = signal(false);
  showDropdown = signal(false);
  dropdownPosition = signal({ top: '0px', left: '0px', transform: 'none' });

  estados = [
    { value: 'activo', label: 'Activo', icon: 'fa-check-circle', class: 'text-success' },
    { value: 'finalizado', label: 'Finalizado', icon: 'fa-flag-checkered', class: 'text-info' },
    { value: 'cancelado', label: 'Cancelado', icon: 'fa-times-circle', class: 'text-danger' },
  ];

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (this.showDropdown()) {
      this.closeDropdown();
    } else {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const dropUp = rect.bottom + 160 > windowHeight;

      this.dropdownPosition.set({
        top: dropUp ? `${rect.top - 4}px` : `${rect.bottom + 4}px`,
        left: `${rect.right - 160}px`,
        transform: dropUp ? 'translateY(-100%)' : 'none',
      });

      this.showDropdown.set(true);
    }
  }

  closeDropdown() {
    this.showDropdown.set(false);
  }

  async updateEstado(estado: string, event: Event) {
    event.stopPropagation();
    this.showDropdown.set(false);

    if (estado === this.estadoActual()) return;

    this.loading.set(true);
    try {
      await this.alquilerService.update(this.alquilerId(), {
        estado: estado as any, // ApiBody<'alquileres', 'update'>['estado'] not strictly typed to these literals
      });
      this.toastService.success('Estado del alquiler actualizado correctamente');
      this.onStatusUpdated.emit();
    } catch (error) {
      console.error('Error al actualizar estado del alquiler:', error);
      this.toastService.error(getErrorMessage(error, 'Error al actualizar el estado del alquiler'));
    } finally {
      this.loading.set(false);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'bg-success/10 text-success';
      case 'finalizado':
        return 'bg-info/10 text-info';
      case 'cancelado':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'fa-check-circle';
      case 'finalizado':
        return 'fa-flag-checkered';
      case 'cancelado':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  }
}
