import { Component, inject, input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutaService } from '@service/admin/ruta.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';

import { ModalForm } from '../../../../components/modal-form/modal-form';

import { AlertService } from '@service/alert.service';

@Component({
  selector: 'app-ruta-paradas-form',
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './ruta-paradas-form.html',
  styleUrl: './ruta-paradas-form.css',
})
export class RutaParadasForm {
  private fb = inject(FormBuilder);
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  ruta = input.required<ApiResponse<'rutas', 'findOne'>>();

  paradas = signal<ApiResponse<'rutas', 'findParadas'>>([]);
  loading = signal(false);
  submitting = signal(false);
  showAddForm = signal(false);
  editingParadaId = signal<number | null>(null);

  paradaForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    orden: [0, [Validators.required, Validators.min(0)]],
    ubicacionLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    ubicacionLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
  });

  constructor() {
    effect(() => {
      if (this.ruta()) {
        this.loadParadas();
      }
    });
  }

  async loadParadas() {
    this.loading.set(true);
    try {
      const paradas = await this.rutaService.findParadas(this.ruta().id);
      const sortedParadas = paradas.sort((a, b) => a.orden - b.orden);
      this.paradas.set(sortedParadas);

      if (sortedParadas.length > 0) {
        const maxOrden = sortedParadas[sortedParadas.length - 1].orden;
        this.paradaForm.patchValue({ orden: maxOrden });
      }
    } catch (error) {
      console.error('Error al cargar paradas:', error);
      this.toastService.error('Error al cargar las paradas de la ruta');
    } finally {
      this.loading.set(false);
    }
  }

  get isFormValid() {
    return this.paradaForm.valid;
  }

  prepareAddParada(ordenSug: number) {
    this.editingParadaId.set(null);
    this.paradaForm.reset();
    this.paradaForm.patchValue({ orden: ordenSug });
    this.showAddForm.set(true);
  }

  prepareEditParada(parada: ApiResponse<'rutas', 'findParadas'>[0]) {
    this.editingParadaId.set(parada.id);
    this.paradaForm.reset({
      nombre: parada.nombre,
      orden: parada.orden,
      ubicacionLat: parada.ubicacionLat,
      ubicacionLng: parada.ubicacionLng,
    });
    this.showAddForm.set(true);
  }

  async saveParada() {
    if (this.paradaForm.invalid) {
      this.paradaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.paradaForm.value;
    const id = this.editingParadaId();

    const payload: any = {
      nombre: formValue.nombre!,
      ubicacionLat: formValue.ubicacionLat!,
      ubicacionLng: formValue.ubicacionLng!,
      orden: formValue.orden!,
    };

    try {
      if (id) {
        await this.rutaService.updateParada(this.ruta().id, id, payload);
        this.toastService.success('Parada actualizada exitosamente');
      } else {
        await this.rutaService.createParada(this.ruta().id, payload);
        this.toastService.success('Parada agregada exitosamente');
      }
      this.paradaForm.reset();
      this.loadParadas();
      this.showAddForm.set(false);
      this.editingParadaId.set(null);
    } catch (error) {
      console.error('Error al guardar parada:', error);
      this.toastService.error(getErrorMessage(error, 'Error al guardar parada'));
    } finally {
      this.submitting.set(false);
    }
  }

  async moveParada(index: number, direction: 'up' | 'down') {
    console.log('Reordering:', direction, index);
    const paradas = [...this.paradas()];
    const neighborIndex = direction === 'up' ? index - 1 : index + 1;

    // Validar índices y evitar mover Origen (0) o Destino (length-1)
    if (neighborIndex <= 0 || neighborIndex >= paradas.length - 1) return;

    const current = paradas[index];
    const neighbor = paradas[neighborIndex];

    const payload = {
      paradas: [
        { id: current.id, orden: neighbor.orden },
        { id: neighbor.id, orden: current.orden },
      ],
    };

    this.loading.set(true);
    try {
      await this.rutaService.reordenarParadas(this.ruta().id, payload);
      this.loadParadas();
    } catch (error) {
      console.error('Error al reordenar:', error);
      this.toastService.error('Error al mover la parada');
      this.loading.set(false);
    }
  }

  async deleteParada(paradaId: number) {
    this.alertService.delete(
      'Eliminar Parada',
      '¿Estás seguro de que deseas eliminar esta parada?',
      () => {
        this.loading.set(true);
        this.rutaService
          .deleteParada(this.ruta().id, paradaId)
          .then(() => {
            this.toastService.success('Parada eliminada');
            this.loadParadas();
          })
          .catch((error) => {
            console.error('Error al eliminar parada:', error);
            this.toastService.error('Error al eliminar parada');
          })
          .finally(() => {
            this.loading.set(false);
          });
      },
    );
  }

  isExtremo(index: number): boolean {
    if (this.paradas().length < 2) return false;
    return index === 0 || index === this.paradas().length - 1;
  }
}
