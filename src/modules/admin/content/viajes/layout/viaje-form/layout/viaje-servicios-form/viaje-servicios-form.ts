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
  RutaParadaResultDto,
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
  paradasRuta = signal<RutaParadaResultDto[]>([]);
  loading = signal(false);
  submitting = signal(false);
  showForm = signal(false);
  editingServicioId = signal<number | null>(null);

  // Form
  servicioForm: FormGroup;

  constructor() {
    this.servicioForm = this.fb.group({
      paradaPartidaId: [null, [Validators.required]],
      paradaLlegadaId: [null, [Validators.required]],
      horaSalida: ['', [Validators.required]],
      horaTermino: [''],
      kmInicial: [null, [Validators.required, Validators.min(0)]],
      kmFinal: [null, [Validators.min(0)]],
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
      const promises: Promise<any>[] = [this.api.viajes.findServicios({ viajeId })];

      if (this.viaje().rutaId) {
        promises.push(this.api.rutas.findParadas({ rutaId: this.viaje().rutaId! }));
      }

      const results = await Promise.all(promises);
      const serviciosRes = results[0];
      this.servicios.set(serviciosRes.data);

      if (results[1]) {
        const paradas = (results[1].data as RutaParadaResultDto[]).sort(
          (a, b) => a.orden - b.orden,
        );
        this.paradasRuta.set(paradas);
      } else {
        this.paradasRuta.set([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async prepareAddServicio() {
    this.editingServicioId.set(null);
    this.loading.set(true);

    try {
      const resp = await this.api.viajes.getNextStep({ viajeId: this.viaje().id });
      const nextStep = resp.data;

      // Habilitar controles antes de resetear
      this.servicioForm.enable();

      this.servicioForm.reset({
        paradaPartidaId: nextStep.paradaPartidaId,
        paradaLlegadaId: nextStep.paradaLlegadaId,
        horaSalida: nextStep.horaSalida,
        kmInicial: nextStep.kmInicial,
        numeroPasajeros: nextStep.numeroPasajeros || 0,
        observaciones: '',
      });

      // Al AGREGAR, bloqueamos lo que viene sugerido para guiar al usuario
      this.disablePreFilledFields();

      this.showForm.set(true);
    } catch (error) {
      console.error('Error getting next step:', error);
      this.toastService.error('Error al obtener sugerencia para el siguiente tramo');
    } finally {
      this.loading.set(false);
    }
  }

  prepareEditServicio(servicio: ViajeServicioResultDto) {
    this.editingServicioId.set(servicio.id);

    // Al EDITAR, permitimos cambiar todo por si hubo errores previos
    this.servicioForm.enable();

    this.servicioForm.patchValue({
      paradaPartidaId: servicio.paradaPartidaId,
      paradaLlegadaId: servicio.paradaLlegadaId,
      horaSalida: servicio.horaSalida,
      horaTermino: servicio.horaTermino,
      kmInicial: servicio.kmInicial,
      kmFinal: servicio.kmFinal,
      numeroPasajeros: servicio.numeroPasajeros,
      observaciones: servicio.observaciones,
    });

    this.showForm.set(true);
  }

  private disablePreFilledFields() {
    Object.keys(this.servicioForm.controls).forEach((key) => {
      const control = this.servicioForm.get(key);
      const value = control?.value;

      // Excepciones: pasajeros y observaciones siempre editables si son valores base
      if (key === 'numeroPasajeros' || key === 'observaciones') {
        control?.enable();
        return;
      }

      // Si el dato ya fue obtenido (no es nulo o vacío), se bloquea
      if (value !== null && value !== undefined && value !== '') {
        control?.disable();
      } else {
        control?.enable();
      }
    });
  }

  async saveServicio() {
    if (this.servicioForm.invalid) {
      this.toastService.warning('Complete los campos obligatorios');
      return;
    }

    this.submitting.set(true);
    // Usar getRawValue para incluir los campos deshabilitados en el payload
    const formValues = this.servicioForm.getRawValue();
    const isEditing = !!this.editingServicioId();
    const viajeId = this.viaje().id;

    const payload = {
      ...formValues,
      kmFinal: formValues.kmFinal || null,
      horaTermino: formValues.horaTermino || null,
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
