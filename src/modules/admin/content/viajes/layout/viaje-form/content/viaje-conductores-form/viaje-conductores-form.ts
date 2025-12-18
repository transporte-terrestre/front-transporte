import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ViajeResultDto } from '@interface/admin/viaje.interface';
import { ConductorInputSearch } from '@module/admin/content/conductores/layout/conductor-input-search/conductor-input-search';

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

  viaje = input.required<ViajeResultDto>();
  onDataChange = output<void>();

  showConductorModal = signal(false);

  addConductorForm = this.fb.group({
    conductorId: ['', Validators.required],
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

  saveConductor() {
    if (this.addConductorForm.invalid) {
      this.addConductorForm.markAllAsTouched();
      return;
    }
    const val = this.addConductorForm.value;
    this.viajeService
      .assignConductor({
        viajeId: this.viaje().id,
        conductorId: Number(val.conductorId),
        rol: val.rol as any,
        esPrincipal: val.esPrincipal || false,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Conductor agregado');
          this.closeAddConductor();
          this.onDataChange.emit();
        },
        error: () => this.toastService.error('Error al agregar conductor'),
      });
  }

  removeConductor(conductorId: number) {
    this.alertService.delete(
      'Quitar Conductor',
      '¿Estás seguro de que deseas quitar este conductor del viaje?',
      () => {
        this.viajeService.removeConductor(this.viaje().id, conductorId).subscribe({
          next: () => {
            this.toastService.success('Conductor eliminado');
            this.onDataChange.emit();
          },
          error: () => this.toastService.error('Error al eliminar conductor'),
        });
      }
    );
  }
}
