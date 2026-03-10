import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalForm } from '../../../../../../components/modal-form/modal-form';
import { DocumentsDateUpload, DocumentWithDate } from '@module/admin/components/documents-date-upload/documents-date-upload';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { ApiBody, ApiResponse } from 'api/backend.api';

@Component({
  selector: 'app-alquiler-terminar-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm, DocumentsDateUpload],
  templateUrl: './alquiler-terminar-modal.html',
  styleUrl: './alquiler-terminar-modal.css',
})
export class AlquilerTerminarModal {
  private fb = inject(FormBuilder);
  private alquilerService = inject(AlquilerService);
  private toastService = inject(ToastService);

  alquiler = input.required<ApiResponse<'alquileres', 'findAll'>['data'][number]>();

  onCompleted = output<void>();

  showModal = signal(false);
  loading = signal(false);
  documentosPendientes = signal<ApiBody<'alquileres', 'createDocumento'>[]>([]);

  terminarForm = this.fb.group({
    fechaFin: ['', [Validators.required]],
    kilometrajeFinal: [null as number | null, [Validators.required, Validators.min(0)]],
    montoTotalFinal: [null as number | null, [Validators.required, Validators.min(0)]],
    observaciones: [''],
  });

  openModal(event: Event) {
    event.stopPropagation();

    const alquiler = this.alquiler();
    const fechaFinDefault = new Date().toISOString().split('T')[0];
    const montoCalculadoDefault = this.calculateMontoFinal(
      alquiler.fechaInicio,
      fechaFinDefault,
      alquiler.montoPorDia,
    );

    this.documentosPendientes.set([]);
    this.terminarForm.patchValue({
      fechaFin: fechaFinDefault,
      kilometrajeFinal:
        alquiler.kilometrajeFinal != null
          ? Number(alquiler.kilometrajeFinal)
          : Number(alquiler.kilometrajeInicial || 0),
      montoTotalFinal:
        alquiler.montoTotalFinal != null
          ? Number(alquiler.montoTotalFinal)
          : montoCalculadoDefault,
      observaciones: alquiler.observaciones || '',
    });

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.documentosPendientes.set([]);
    this.terminarForm.reset({
      fechaFin: '',
      kilometrajeFinal: null,
      montoTotalFinal: null,
      observaciones: '',
    });
  }

  handleDocumentoUpload(event: DocumentWithDate) {
    const alquilerId = this.alquiler().id;
    const current = this.documentosPendientes();

    this.documentosPendientes.set([
      ...current,
      {
        alquilerId,
        tipo: 'otros',
        nombre: event.nombre,
        url: event.url,
      },
    ]);

    this.toastService.success('Documento adjuntado al cierre');
  }

  async confirmTerminarAlquiler() {
    if (this.terminarForm.invalid) {
      this.terminarForm.markAllAsTouched();
      return;
    }

    const alquilerId = this.alquiler().id;
    const formValue = this.terminarForm.value;

    this.loading.set(true);
    try {
      await this.alquilerService.terminar(alquilerId, {
        fechaFin: new Date(String(formValue.fechaFin)).toISOString(),
        kilometrajeFinal: Number(formValue.kilometrajeFinal),
        montoTotalFinal: Number(formValue.montoTotalFinal),
        observaciones: formValue.observaciones || undefined,
      } as ApiBody<'alquileres', 'terminar'>);

      for (const doc of this.documentosPendientes()) {
        await this.alquilerService.createDocumento(doc);
      }

      this.toastService.success('Alquiler finalizado correctamente');
      this.closeModal();
      this.onCompleted.emit();
    } catch (error) {
      console.error('Error al finalizar alquiler:', error);
      this.toastService.error(getErrorMessage(error, 'Error al finalizar alquiler'));
      this.loading.set(false);
    }
  }

  private getDiffDias(start: string | Date, end: string | Date): number {
    const pStart = new Date(start);
    const pEnd = new Date(end);
    const diffTime = Math.abs(pEnd.getTime() - pStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private calculateMontoFinal(
    fechaInicio: string | Date,
    fechaFin: string | Date,
    montoPorDia: string | number | null | undefined,
  ): number {
    const dias = Math.max(1, this.getDiffDias(fechaInicio, fechaFin));
    const monto = Number(montoPorDia ?? 0);
    return Number.isFinite(monto) ? Number((dias * monto).toFixed(2)) : 0;
  }
}
