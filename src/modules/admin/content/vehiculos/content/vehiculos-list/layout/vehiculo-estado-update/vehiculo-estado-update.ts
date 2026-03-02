import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-vehiculo-estado-update',
  imports: [CommonModule],
  templateUrl: './vehiculo-estado-update.html',
  styleUrl: './vehiculo-estado-update.css',
})
export class VehiculoEstadoUpdate {
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  vehiculoId = input.required<number>();
  estadoActual = input.required<string>();

  onStatusUpdated = output<void>();

  loading = signal(false);
  showDropdown = signal(false);
  dropdownPosition = signal({ top: '0px', left: '0px', transform: 'none' });

  estados = [
    { value: 'disponible', label: 'Disponible', icon: 'fa-check-circle', class: 'text-success' },
    { value: 'circulacion', label: 'Circulacion', icon: 'fa-road', class: 'text-info' },
    { value: 'taller', label: 'Taller', icon: 'fa-wrench', class: 'text-warning' },
    { value: 'retirado', label: 'Retirado', icon: 'fa-times-circle', class: 'text-danger' },
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
      await this.vehiculoService.update(this.vehiculoId(), {
        estado: estado as ApiBody<'vehiculos', 'update'>['estado'],
      });
      this.toastService.success('Estado actualizado correctamente');
      this.onStatusUpdated.emit();
    } catch (error) {
      console.error('Error al actualizar estado del vehículo:', error);
      this.toastService.error(getErrorMessage(error, 'Error al actualizar el estado del vehículo'));
    } finally {
      this.loading.set(false);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'disponible':
        return 'bg-success/10 text-success';
      case 'circulacion':
        return 'bg-info/10 text-info';
      case 'taller':
        return 'bg-warning/10 text-warning';
      case 'retirado':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'disponible':
        return 'fa-check-circle';
      case 'circulacion':
        return 'fa-road';
      case 'taller':
        return 'fa-wrench';
      case 'retirado':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  }
}
