import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ClienteInputSearch } from '../../../../components/input-searchs/cliente-input-search/cliente-input-search';
import { ConductorInputSearch } from '../../../../components/input-searchs/conductor-input-search/conductor-input-search';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';

@Component({
  selector: 'app-alquiler-form',
  imports: [CommonModule, ReactiveFormsModule, ClienteInputSearch, VehiculoInputSearch, ConductorInputSearch],
  templateUrl: './alquiler-form.html',
  styleUrl: './alquiler-form.css',
})
export class AlquilerForm {
  private fb = inject(FormBuilder);

  editMode = input<boolean>(false);
  initialData = input<ApiResponse<'alquileres', 'findOne'> | null>(null);

  onSubmitForm = output<ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'>>();

  form = this.fb.group({
    clienteId: this.fb.control<ApiResponse<'clientes', 'findAll'>['data'][number] | number | null>(
      null,
      [Validators.required],
    ),
    vehiculoId: this.fb.control<
      ApiResponse<'vehiculos', 'findAll'>['data'][number] | number | null
    >(null, [Validators.required]),
    tipo: this.fb.control<ApiBody<'alquileres', 'create'>['tipo']>('maquina_seca', [
      Validators.required,
    ]),
    conductorId: this.fb.control<
      ApiResponse<'conductores', 'findAll'>['data'][number] | number | null
    >(null),

    kilometrajeInicial: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    montoPorDia: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    razon: this.fb.control<string>(''),

    fechaInicio: this.fb.control<string>('', [Validators.required]),
    fechaFin: this.fb.control<string | null>(null),

    observaciones: this.fb.control<string>(''),
    marcarComoAlquilado: this.fb.control<boolean>(true),
  });

  constructor() {
    // Conductor starts disabled since default tipo is maquina_seca
    this.form.get('conductorId')?.disable();

    this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
      const conductorControl = this.form.get('conductorId');
      if (tipo === 'maquina_operada') {
        conductorControl?.enable();
        conductorControl?.setValidators([Validators.required]);
      } else {
        conductorControl?.clearValidators();
        conductorControl?.setValue(null);
        conductorControl?.disable();
      }
      conductorControl?.updateValueAndValidity();
    });

    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          clienteId: data.clienteId,
          vehiculoId: data.vehiculoId,
          tipo: data.tipo || 'maquina_seca',
          conductorId: data.conductorId || null,
          kilometrajeInicial:
            data.kilometrajeInicial != null ? Number(data.kilometrajeInicial) : null,
          montoPorDia: data.montoPorDia != null ? Number(data.montoPorDia) : null,
          razon: data.razon || '',

          fechaInicio: new Date(data.fechaInicio).toISOString().split('T')[0],
          fechaFin: data.fechaFin ? new Date(data.fechaFin).toISOString().split('T')[0] : null,

          observaciones: data.observaciones || '',
        });

        // Enable/disable conductor based on loaded tipo
        const conductorControl = this.form.get('conductorId');
        if (data.tipo === 'maquina_operada') {
          conductorControl?.enable();
        } else {
          conductorControl?.disable();
        }
      }
    });
  }

  submitForm() {
    if (this.form.valid) {
      const rawValue = this.form.value;

      const clienteId = this.resolveEntityId(rawValue.clienteId);
      const vehiculoId = this.resolveEntityId(rawValue.vehiculoId);

      if (!clienteId || !vehiculoId) {
        this.form.markAllAsTouched();
        return;
      }

      const conductorId =
        rawValue.tipo === 'maquina_operada'
          ? this.resolveEntityId(rawValue.conductorId)
          : undefined;

      const payload: ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'> = {
        clienteId,
        vehiculoId,
        tipo: rawValue.tipo || 'maquina_seca',
        ...(conductorId ? { conductorId } : {}),
        kilometrajeInicial: Number(rawValue.kilometrajeInicial || 0),
        montoPorDia: Number(rawValue.montoPorDia || 0),
        razon: rawValue.razon || undefined,
        fechaInicio: rawValue.fechaInicio ? new Date(rawValue.fechaInicio).toISOString() : '',
        ...(rawValue.fechaFin ? { fechaFin: new Date(rawValue.fechaFin).toISOString() } : {}),
        observaciones: rawValue.observaciones || undefined,
        marcarComoAlquilado: !!rawValue.marcarComoAlquilado,
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

  isTipoOperada(): boolean {
    return this.form.get('tipo')?.value === 'maquina_operada';
  }

  private resolveEntityId(value: { id: number } | number | null | undefined): number | undefined {
    if (value == null) {
      return undefined;
    }

    const id = typeof value === 'object' ? value.id : value;
    const normalized = Number(id);
    return Number.isFinite(normalized) ? normalized : undefined;
  }
}
