import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalForm } from '../../../../../../components/modal-form/modal-form';

export interface SucursalData {
  id?: number;
  distrito: string;
  ubicacionExacta: string;
}

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './sucursal-form.html',
})
export class SucursalForm {
  private fb = inject(FormBuilder);

  sucursal = input<SucursalData | null>(null);
  editMode = input<boolean>(false);

  onCancel = output<void>();
  onSave = output<SucursalData>();

  form: FormGroup = this.fb.group({
    distrito: ['', [Validators.required, Validators.maxLength(100)]],
    ubicacionExacta: ['', [Validators.required, Validators.maxLength(255)]],
  });

  constructor() {
    effect(() => {
      const data = this.sucursal();
      if (data) {
        this.form.patchValue({
          distrito: data.distrito,
          ubicacionExacta: data.ubicacionExacta,
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
    const data: SucursalData = {
      distrito: value.distrito,
      ubicacionExacta: value.ubicacionExacta,
    };

    const currentSucursal = this.sucursal();
    if (currentSucursal && currentSucursal.id) {
      data.id = currentSucursal.id;
    }

    this.onSave.emit(data);
  }

  cancel() {
    this.onCancel.emit();
  }
}
