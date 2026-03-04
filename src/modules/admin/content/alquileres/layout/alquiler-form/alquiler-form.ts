import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';

@Component({
  selector: 'app-alquiler-form',
  imports: [CommonModule, ReactiveFormsModule, VehiculoInputSearch],
  templateUrl: './alquiler-form.html',
  styleUrl: './alquiler-form.css',
})
export class AlquilerForm {
  private fb = inject(FormBuilder);

  editMode = input<boolean>(false);
  initialData = input<ApiResponse<'alquileres', 'findOne'> | null>(null);

  onSubmitForm = output<ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'>>();

  form = this.fb.group({
    vehiculoId: this.fb.control<number | null>(null, [Validators.required]),

    fechaInicio: this.fb.control<string>('', [Validators.required]),
    fechaFin: this.fb.control<string | null>(null),

    monto: this.fb.control<number | null>(null),
    observaciones: this.fb.control<string>(''),
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          vehiculoId: data.vehiculoId,

          fechaInicio: new Date(data.fechaInicio).toISOString().split('T')[0],
          fechaFin: data.fechaFin ? new Date(data.fechaFin).toISOString().split('T')[0] : null,

          monto: data.monto ? Number(data.monto) : null,
          observaciones: data.observaciones || '',
        });
      }
    });
  }

  submitForm() {
    if (this.form.valid) {
      const rawValue = this.form.value;

      const payload: any = {
        ...rawValue,
        vehiculoId:
          typeof rawValue.vehiculoId === 'object' && rawValue.vehiculoId !== null
            ? (rawValue.vehiculoId as any).id
            : rawValue.vehiculoId,
      };

      this.onSubmitForm.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
