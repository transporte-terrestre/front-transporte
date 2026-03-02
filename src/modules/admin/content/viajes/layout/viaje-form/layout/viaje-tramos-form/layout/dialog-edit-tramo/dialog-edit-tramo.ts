import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeTramoResultDto } from 'api/backend.api';

@Component({
  selector: 'app-dialog-edit-tramo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './dialog-edit-tramo.html',
})
export class DialogEditTramoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);

  // Inputs
  tramo = input.required<ViajeTramoResultDto>();

  // Outputs
  onSaved = output<void>();
  onClose = output<void>();

  // State
  isSubmitting = false;
  esParada = false;
  esDescanso = false;

  // Form
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      nombreLugar: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      kilometrajeFinal: [0, [Validators.required, Validators.min(0)]],
      numeroPasajeros: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    const s = this.tramo();
    this.esParada = s.tipo === 'parada';
    this.esDescanso = s.tipo === 'descanso';

    // Para descanso, no requerimos nombre, km ni pasajeros
    if (this.esDescanso) {
      this.form.get('nombreLugar')?.clearValidators();
      this.form.get('kilometrajeFinal')?.clearValidators();
      this.form.get('numeroPasajeros')?.clearValidators();
      this.form.get('nombreLugar')?.updateValueAndValidity();
      this.form.get('kilometrajeFinal')?.updateValueAndValidity();
      this.form.get('numeroPasajeros')?.updateValueAndValidity();
    }

    let fValue = '';
    let hValue = '';

    if (s.horaFinal) {
      const d = new Date(s.horaFinal);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      const hours = String(d.getUTCHours()).padStart(2, '0');
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      fValue = `${year}-${month}-${day}`;
      hValue = `${hours}:${minutes}`;
    }

    this.form.patchValue({
      nombreLugar: s.nombreLugar || '',
      fecha: fValue,
      hora: hValue,
      kilometrajeFinal: s.kilometrajeFinal || 0,
      numeroPasajeros: s.numeroPasajeros || 0,
    });
  }

  async save() {
    if (this.form.invalid) {
      this.toastService.warning('Complete todos los campos');
      return;
    }

    this.isSubmitting = true;
    const val = this.form.getRawValue();
    const isoString = `${val.fecha}T${val.hora}:00.000Z`;

    try {
      await this.viajeService.updateTramo(this.tramo().id, {
        nombreLugar: val.nombreLugar,
        horaFinal: isoString,
        kilometrajeFinal: Number(val.kilometrajeFinal),
        numeroPasajeros: Number(val.numeroPasajeros),
      });
      this.toastService.success('Registro actualizado');
      this.onSaved.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al actualizar registro');
    } finally {
      this.isSubmitting = false;
    }
  }

  close() {
    this.onClose.emit();
  }
}
