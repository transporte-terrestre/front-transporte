import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-viaje-status-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viaje-estado-update.html',
  styleUrl: './viaje-estado-update.css',
})
export class ViajeStatusUpdate {
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);

  viajeId = input.required<number>();
  estadoActual = input.required<string>();

  onStatusUpdated = output<void>();

  loading = signal(false);
  showDropdown = signal(false);
  dropdownPosition = signal({ top: '0px', left: '0px', transform: 'none' });

  estados = [
    { value: 'programado', label: 'Programado', icon: 'fa-clock', class: 'text-info' },
    { value: 'en_progreso', label: 'En Progreso', icon: 'fa-truck', class: 'text-warning' },
    { value: 'completado', label: 'Completado', icon: 'fa-check-circle', class: 'text-success' },
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

      // Default w-40 = 160px. Heights vary, ~160px.
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
      await this.viajeService.update(this.viajeId(), {
        estado: estado as ApiBody<'viajes', 'update'>['estado'],
      });
      this.toastService.success('Estado del viaje actualizado correctamente');
      this.onStatusUpdated.emit();
    } catch (error) {
      console.error('Error al actualizar estado del viaje:', error);
      this.toastService.error(getErrorMessage(error, 'Error al actualizar el estado del viaje'));
    } finally {
      this.loading.set(false);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'programado':
        return 'bg-info/10 text-info';
      case 'en_progreso':
        return 'bg-warning/10 text-warning';
      case 'completado':
        return 'bg-success/10 text-success';
      case 'cancelado':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'programado':
        return 'fa-clock';
      case 'en_progreso':
        return 'fa-truck';
      case 'completado':
        return 'fa-check-circle';
      case 'cancelado':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'programado':
        return 'Programado';
      case 'en_progreso':
        return 'En Progreso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  }
}
