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

  // UI State for form
  isPartidaManual = signal(false);
  isLlegadaManual = signal(false);

  constructor() {
    this.servicioForm = this.fb.group({
      // Origen
      paradaPartidaId: [null],
      paradaPartidaOcasional: [''],
      // Destino
      paradaLlegadaId: [null],
      paradaLlegadaOcasional: [''],
      // Datos
      horaSalida: ['', [Validators.required]],
      horaTermino: [''],
      kmInicial: [null, [Validators.required, Validators.min(0)]],
      kmFinal: [null, [Validators.min(0)]],
      numeroPasajeros: [0, [Validators.min(0)]],
      observaciones: [''],
    });

    // Effect to reload services when viaje ID changes
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

      // Load route stops only if it's a fixed route or has a route ID
      if (this.viaje().rutaId) {
        promises.push(this.api.rutas.findParadas({ rutaId: this.viaje().rutaId! }));
      }

      const results = await Promise.all(promises);
      const serviciosRes = results[0];
      this.servicios.set(serviciosRes.data);

      if (results[1]) {
        // Sort paradas by order
        const paradas = (results[1].data as RutaParadaResultDto[]).sort(
          (a, b) => a.orden - b.orden,
        );
        this.paradasRuta.set(paradas);
      } else {
        this.paradasRuta.set([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Don't show error toast on simple load failure to avoid spam, maybe log it
    } finally {
      this.loading.set(false);
    }
  }

  // ... (prepare methods remain unchanged)

  prepareAddServicio() {
    this.editingServicioId.set(null);
    // Intentar pre-llenar basándose en el último servicio
    const lastServicio =
      this.servicios().length > 0 ? this.servicios()[this.servicios().length - 1] : null;

    // Si hay último servicio, el origen del nuevo es el destino del anterior
    let nextOrigenId = lastServicio?.paradaLlegadaId || null;
    let nextOrigenManual = lastServicio?.paradaLlegadaOcasional || '';

    // Si no hay último servicio y hay paradas, el origen es la primera parada
    if (!lastServicio && this.paradasRuta().length > 0) {
      nextOrigenId = this.paradasRuta()[0].id;
    }

    this.servicioForm.reset({
      numeroPasajeros: lastServicio?.numeroPasajeros || 0,
      kmInicial: lastServicio?.kmFinal || null,
      paradaPartidaId: nextOrigenId,
      paradaPartidaOcasional: nextOrigenManual,
      // Sugerir hora de salida si el anterior tuvo hora termino
      horaSalida: lastServicio?.horaTermino || '',
    });

    // Set manual types logic
    this.isPartidaManual.set(!!nextOrigenManual || !nextOrigenId);
    this.isLlegadaManual.set(false); // Default to route stop if possible

    this.showForm.set(true);
  }

  prepareEditServicio(servicio: ViajeServicioResultDto) {
    this.editingServicioId.set(servicio.id);
    this.servicioForm.patchValue({
      paradaPartidaId: servicio.paradaPartidaId,
      paradaPartidaOcasional: servicio.paradaPartidaOcasional,
      paradaLlegadaId: servicio.paradaLlegadaId,
      paradaLlegadaOcasional: servicio.paradaLlegadaOcasional,
      horaSalida: servicio.horaSalida,
      horaTermino: servicio.horaTermino,
      kmInicial: servicio.kmInicial,
      kmFinal: servicio.kmFinal,
      numeroPasajeros: servicio.numeroPasajeros,
      observaciones: servicio.observaciones,
    });

    this.isPartidaManual.set(!!servicio.paradaPartidaOcasional || !servicio.paradaPartidaId);
    this.isLlegadaManual.set(!!servicio.paradaLlegadaOcasional || !servicio.paradaLlegadaId);

    this.showForm.set(true);
  }

  async saveServicio() {
    if (this.servicioForm.invalid) {
      this.toastService.warning('Complete los campos obligatorios');
      return;
    }

    this.submitting.set(true);
    const formValues = this.servicioForm.value;
    const isEditing = !!this.editingServicioId();
    const viajeId = this.viaje().id;

    // Prepare payload handling switching between Manual/Fixed
    const startId = this.isPartidaManual() ? null : formValues.paradaPartidaId;
    const startText = this.isPartidaManual() ? formValues.paradaPartidaOcasional : null;

    const endId = this.isLlegadaManual() ? null : formValues.paradaLlegadaId;
    const endText = this.isLlegadaManual() ? formValues.paradaLlegadaOcasional : null;

    if (!startId && !startText) {
      this.toastService.warning('Debe especificar un punto de partida');
      this.submitting.set(false);
      return;
    }

    if (!endId && !endText) {
      this.toastService.warning('Debe especificar un punto de llegada');
      this.submitting.set(false);
      return;
    }

    const payload = {
      ...formValues,
      paradaPartidaId: startId,
      paradaPartidaOcasional: startText,
      paradaLlegadaId: endId,
      paradaLlegadaOcasional: endText,
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

  async moveServicio(index: number, direction: 'up' | 'down') {
    const currentList = this.servicios();
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentList.length - 1)
    ) {
      return;
    }

    const neighborIndex = direction === 'up' ? index - 1 : index + 1;
    const current = currentList[index];
    const neighbor = currentList[neighborIndex];

    const payload = {
      servicios: [
        { id: current.id, orden: neighbor.orden },
        { id: neighbor.id, orden: current.orden },
      ],
    };

    try {
      await this.api.viajes.reordenarServicios({ viajeId: this.viaje().id }, payload);
      this.loadData();
    } catch (error) {
      console.error('Error reordering servicios:', error);
      this.toastService.error('Error al mover el tramo');
    }
  }
}
