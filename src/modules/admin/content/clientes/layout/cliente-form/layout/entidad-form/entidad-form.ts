import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalForm } from '../../../../../../components/modal-form/modal-form';

export interface EntidadData {
  id?: number;
  clienteId: number;
  nombreServicio: string;
}

@Component({
  selector: 'app-entidad-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './entidad-form.html',
  styleUrl: './entidad-form.css',
})
export class EntidadForm {
  private fb = inject(FormBuilder);

  entidad = input<EntidadData | null>(null);
  clienteId = input.required<number>();

  onCancel = output<void>();
  onSave = output<EntidadData>();

  form: FormGroup = this.fb.group({
    nombreServicio: ['', [Validators.required, Validators.maxLength(200)]],
  });

  constructor() {
    effect(() => {
      const data = this.entidad();
      if (data) {
        this.form.patchValue({
          nombreServicio: data.nombreServicio,
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
      nombreServicio: value.nombreServicio,
    };

    const currentEntidad = this.entidad();

    if (currentEntidad) {
      data.id = currentEntidad.id;
    }

    this.onSave.emit(data);
  }

  cancel() {
    this.onCancel.emit();
  }
}
