import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConductorService } from '@service/admin/conductor.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-conductor-estado-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conductor-estado-update.html',
})
export class ConductorEstadoUpdate {
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);

  conductorId = input.required<number>();
  estadoActual = input.required<string>();

  onStatusUpdated = output<void>();

  loading = signal(false);
  showDropdown = signal(false);
  dropdownPosition = signal({ top: '0px', left: '0px', transform: 'none' });

  estados = [
    { value: 'activo', label: 'Activo', icon: 'fa-check-circle', class: 'text-success' },
    { value: 'inactivo', label: 'Inactivo', icon: 'fa-times-circle', class: 'text-danger' },
    { value: 'eventual', label: 'Eventual', icon: 'fa-user-clock', class: 'text-warning' },
  ];

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (this.showDropdown()) {
      this.closeDropdown();
    } else {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Default w-40 = 160px.
      const dropUp = rect.bottom + 140 > windowHeight;

      this.dropdownPosition.set({
        top: dropUp ? `${rect.top - 4}px` : `${rect.bottom + 4}px`,
        left: `${rect.right - 150}px`,
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
      await this.conductorService.update(this.conductorId(), {
        estado: estado as ApiBody<'conductores', 'update'>['estado'],
      });
      this.toastService.success('Estado actualizado correctamente');
      this.onStatusUpdated.emit();
    } catch (error) {
      console.error('Error al actualizar estado del conductor:', error);
      this.toastService.error(getErrorMessage(error, 'Error al actualizar el estado del conductor'));
    } finally {
      this.loading.set(false);
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'bg-success/10 text-success';
      case 'inactivo':
        return 'bg-danger/10 text-danger';
      case 'eventual':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'fa-check-circle';
      case 'inactivo':
        return 'fa-times-circle';
      case 'eventual':
        return 'fa-user-clock';
      default:
        return 'fa-circle';
    }
  }
}
