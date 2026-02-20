import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { Api } from 'api/backend.api';
import {
  ViajeResultDto,
  ViajeServicioResultDto,
  ViajeServicioCreateDto,
  ViajeServicioUpdateDto,
} from 'api/backend.api';
import { AlertService } from '@service/alert.service';

@Component({
  selector: 'app-viaje-servicios-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './viaje-servicios-form.html',
  styleUrl: './viaje-servicios-form.css',
})
export class ViajeServiciosFormComponent {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private api = inject(Api);

  // Inputs
  viaje = input.required<ViajeResultDto>();

  // State
  servicios = signal<ViajeServicioResultDto[]>([]);
  loading = signal(false);
  submitting = signal(false);
  showForm = signal(false);
  editingServicioId = signal<number | null>(null);

  // Form
  servicioForm: FormGroup;

  constructor() {
    this.servicioForm = this.fb.group({
      tipo: ['trayecto', [Validators.required]],
      nombreLugar: ['', [Validators.required]],
      horaFinal: ['', [Validators.required]],
      kilometrajeFinal: [1, [Validators.required, Validators.min(0)]], // Default > 0
      numeroPasajeros: [0, [Validators.min(0)]],
      observaciones: [''],
    });

    effect(() => {
      const v = this.viaje();
      if (v?.id) {
        this.loadData();
      }
    });
  }

  async loadData() {
    this.loading.set(true);
    try {
      const viajeId = this.viaje().id;
      // No more findParadas needed
      const serviciosRes = await this.api.viajes.findServicios({ viajeId });
      this.servicios.set(serviciosRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async prepareAddServicio() {
    this.editingServicioId.set(null);
    this.servicioForm.enable();

    // Default to current time for datetime-local
    const now = new Date();
    // Ajustar por la zona horaria para formato yyyy-MM-ddThh:mm
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const defaultTime = now.toISOString().slice(0, 16);

    this.servicioForm.reset({
      tipo: 'trayecto',
      nombreLugar: '',
      horaFinal: defaultTime,
      kilometrajeFinal: null, // Debería forzar a llenar el km, pero le ponemos default null para que salte validación si olvida
      numeroPasajeros: 0,
      observaciones: '',
    });

    this.showForm.set(true);
  }

  prepareEditServicio(servicio: ViajeServicioResultDto) {
    this.editingServicioId.set(servicio.id);
    this.servicioForm.enable();

    let formattedHora = '';
    if (servicio.horaFinal) {
      const d = new Date(servicio.horaFinal);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      formattedHora = d.toISOString().slice(0, 16);
    }

    this.servicioForm.patchValue({
      tipo: servicio.tipo || 'trayecto',
      nombreLugar: servicio.nombreLugar || '',
      horaFinal: formattedHora,
      kilometrajeFinal: servicio.kilometrajeFinal,
      numeroPasajeros: servicio.numeroPasajeros,
      observaciones: servicio.observaciones,
    });

    this.showForm.set(true);
  }

  async saveServicio() {
    if (this.servicioForm.invalid) {
      this.toastService.warning('Complete los campos obligatorios');
      return;
    }

    this.submitting.set(true);
    const formValues = this.servicioForm.getRawValue();
    const isEditing = !!this.editingServicioId();
    const viajeId = this.viaje().id;

    const payload = {
      ...formValues,
      kilometrajeFinal: formValues.kilometrajeFinal || null,
      horaFinal: formValues.horaFinal ? new Date(formValues.horaFinal).toISOString() : null,
      observaciones: formValues.observaciones || null,
    };

    try {
      if (isEditing) {
        const id = this.editingServicioId()!;
        await this.api.viajes.updateServicio({ id }, payload as ViajeServicioUpdateDto);
        this.toastService.success('Tramo actualizado correctamente');
      } else {
        await this.api.viajes.createServicio({ viajeId }, payload as ViajeServicioCreateDto);
        this.toastService.success('Tramo agregado correctamente');
      }

      this.showForm.set(false);
      this.loadData();
    } catch (error) {
      console.error('Error saving servicio:', error);
      this.toastService.error('Error al guardar el tramo');
    } finally {
      this.submitting.set(false);
    }
  }

  async deleteServicio(id: number) {
    this.alertService.delete(
      'Eliminar Tramo',
      '¿Estás seguro de eliminar este tramo del viaje?',
      async () => {
        try {
          await this.api.viajes.deleteServicio({ id });
          this.toastService.success('Tramo eliminado');
          this.loadData();
        } catch (error) {
          console.error('Error deleting servicio:', error);
          this.toastService.error('Error al eliminar el tramo');
        }
      },
    );
  }
}
