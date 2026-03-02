import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ConductorInputSearch } from '@module/admin/components/input-searchs/conductor-input-search/conductor-input-search';

@Component({
  selector: 'app-viaje-conductores-form',
  imports: [CommonModule, ReactiveFormsModule, ConductorInputSearch],
  templateUrl: './viaje-conductores-form.html',
  styleUrl: './viaje-conductores-form.css',
})
export class ViajeConductoresForm {
  private fb = inject(FormBuilder);
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  viaje = input.required<ApiResponse<'viajes', 'findOne'>>();
  onDataChange = output<void>();

  showConductorModal = signal(false);

  addConductorForm = this.fb.group({
    conductor: [null, Validators.required],
    rol: ['conductor', Validators.required],
    esPrincipal: [false],
  });

  openAddConductor() {
    this.addConductorForm.reset({ rol: 'conductor', esPrincipal: false });
    this.showConductorModal.set(true);
  }

  closeAddConductor() {
    this.showConductorModal.set(false);
  }

  async saveConductor() {
    if (this.addConductorForm.invalid) {
      this.addConductorForm.markAllAsTouched();
      return;
    }
    const val = this.addConductorForm.value;
    const conductor = val.conductor as { id: number } | number | null;
    const conductorId =
      conductor && typeof conductor === 'object' && 'id' in conductor
        ? Number(conductor.id)
        : Number(conductor);

    if (!conductorId) return;

    try {
      await this.viajeService.assignConductor({
        viajeId: this.viaje().id,
        conductorId: conductorId,
        rol: (val.rol || 'conductor') as ApiBody<'viajes', 'assignConductor'>['rol'],
        esPrincipal: val.esPrincipal || false,
      });
      this.toastService.success('Conductor agregado');
      this.closeAddConductor();
      this.onDataChange.emit();
    } catch (e) {
      this.toastService.error('Error al agregar conductor');
    }
  }

  removeConductor(conductorId: number) {
    this.alertService.delete(
      'Quitar Conductor',
      '¿Estás seguro de que deseas quitar este conductor del viaje?',
      () => {
        this.viajeService.removeConductor(this.viaje().id, conductorId).then(
          () => {
            this.toastService.success('Conductor eliminado');
            this.onDataChange.emit();
          },
          () => this.toastService.error('Error al eliminar conductor'),
        );
      },
    );
  }
}
