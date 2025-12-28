import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { VehiculoInputSearch } from '@module/admin/content/vehiculos/layout/vehiculo-input-search/vehiculo-input-search';

@Component({
  selector: 'app-viaje-vehiculos-form',
  imports: [CommonModule, ReactiveFormsModule, VehiculoInputSearch],
  templateUrl: './viaje-vehiculos-form.html',
  styleUrl: './viaje-vehiculos-form.css',
})
export class ViajeVehiculosForm {
  private fb = inject(FormBuilder);
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  viaje = input.required<ApiResponse<'viajes', 'findOne'>>();
  onDataChange = output<void>();

  showVehiculoModal = signal(false);

  addVehiculoForm = this.fb.group({
    vehiculo: [null, Validators.required],
    rol: ['apoyo', Validators.required],
    esPrincipal: [false],
  });

  openAddVehiculo() {
    this.addVehiculoForm.reset({ rol: 'apoyo', esPrincipal: false });
    this.showVehiculoModal.set(true);
  }

  closeAddVehiculo() {
    this.showVehiculoModal.set(false);
  }

  async saveVehiculo() {
    if (this.addVehiculoForm.invalid) {
      this.addVehiculoForm.markAllAsTouched();
      return;
    }
    const val = this.addVehiculoForm.value;
    const vehiculo = val.vehiculo as { id: number } | number | null;
    const vehiculoId =
      vehiculo && typeof vehiculo === 'object' && 'id' in vehiculo
        ? Number(vehiculo.id)
        : Number(vehiculo);

    if (!vehiculoId) return;

    try {
      await this.viajeService.assignVehiculo({
        viajeId: this.viaje().id,
        vehiculoId: vehiculoId,
        rol: (val.rol || 'apoyo') as ApiBody<'viajes', 'assignVehiculo'>['rol'],
        esPrincipal: val.esPrincipal || false,
      });
      this.toastService.success('Vehículo agregado');
      this.closeAddVehiculo();
      this.onDataChange.emit();
    } catch (e) {
      this.toastService.error('Error al agregar vehículo');
    }
  }

  removeVehiculo(vehiculoId: number) {
    this.alertService.delete(
      'Quitar Vehículo',
      '¿Estás seguro de que deseas quitar este vehículo del viaje?',
      () => {
        this.viajeService.removeVehiculo(this.viaje().id, vehiculoId).then(
          () => {
            this.toastService.success('Vehículo eliminado');
            this.onDataChange.emit();
          },
          () => this.toastService.error('Error al eliminar vehículo')
        );
      }
    );
  }
}
