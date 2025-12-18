import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ViajeResultDto } from '@interface/admin/viaje.interface';
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

  viaje = input.required<ViajeResultDto>();
  onDataChange = output<void>();

  showVehiculoModal = signal(false);

  addVehiculoForm = this.fb.group({
    vehiculoId: ['', Validators.required],
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

  saveVehiculo() {
    if (this.addVehiculoForm.invalid) {
      this.addVehiculoForm.markAllAsTouched();
      return;
    }
    const val = this.addVehiculoForm.value;
    this.viajeService
      .assignVehiculo({
        viajeId: this.viaje().id,
        vehiculoId: Number(val.vehiculoId),
        rol: val.rol as any,
        esPrincipal: val.esPrincipal || false,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Vehículo agregado');
          this.closeAddVehiculo();
          this.onDataChange.emit();
        },
        error: () => this.toastService.error('Error al agregar vehículo'),
      });
  }

  removeVehiculo(vehiculoId: number) {
    this.alertService.delete(
      'Quitar Vehículo',
      '¿Estás seguro de que deseas quitar este vehículo del viaje?',
      () => {
        this.viajeService.removeVehiculo(this.viaje().id, vehiculoId).subscribe({
          next: () => {
            this.toastService.success('Vehículo eliminado');
            this.onDataChange.emit();
          },
          error: () => this.toastService.error('Error al eliminar vehículo'),
        });
      }
    );
  }
}
