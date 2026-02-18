import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiBody } from 'api/backend.api';
import { ModalForm } from '../../../../../../components/modal-form/modal-form';

export interface PasajeroData {
  id?: number;
  clienteId: number;
  dni: string;
  nombres: string;
  apellidos: string;
}

@Component({
  selector: 'app-pasajero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './pasajero-form.html',
  styleUrl: './pasajero-form.css',
})
export class PasajeroForm {
  private fb = inject(FormBuilder);

  pasajero = input<PasajeroData | null>(null);
  clienteId = input.required<number>();

  onCancel = output<void>();
  onSave = output<PasajeroData>();

  form: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    effect(() => {
      const data = this.pasajero();
      if (data) {
        this.form.patchValue({
          dni: data.dni,
          nombres: data.nombres,
          apellidos: data.apellidos,
        });
      } else {
        this.form.reset();
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const data: any = {
      clienteId: this.clienteId(),
      dni: value.dni,
      nombres: value.nombres,
      apellidos: value.apellidos,
    };

    const currentPasajero = this.pasajero();

    if (currentPasajero) {
      data.id = currentPasajero.id;
    }

    this.onSave.emit(data);
  }

  cancel() {
    this.onCancel.emit();
  }
}
