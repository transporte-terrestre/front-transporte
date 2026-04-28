import { Component, effect, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { ApiBody, ApiResponse, AlquilerVehiculoDetalleDto, AlquilerDetalleResultDto } from 'api/backend.api';
import { ClienteInputSearch } from '../../../../components/input-searchs/cliente-input-search/cliente-input-search';
import { ConductorInputSearch } from '../../../../components/input-searchs/conductor-input-search/conductor-input-search';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-alquiler-form',
  imports: [CommonModule, ReactiveFormsModule, ClienteInputSearch, VehiculoInputSearch, ConductorInputSearch],
  templateUrl: './alquiler-form.html',
  styleUrl: './alquiler-form.css',
})
export class AlquilerForm implements OnInit {
  private fb = inject(FormBuilder);
  private alquilerService = inject(AlquilerService);

  editMode = input<boolean>(false);
  initialData = input<ApiResponse<'alquileres', 'findOne'> | null>(null);

  onSubmitForm = output<ApiBody<'alquileres', 'create'>>();

  vehiculoValidacionMsg = signal<Record<number, { status: boolean; message: string } | null>>({});
  private checkAvailabilityTimeout: ReturnType<typeof setTimeout> | null = null;

  form = this.fb.group({
    clienteId: this.fb.control<ApiResponse<'clientes', 'findAll'>['data'][number] | number | null>(
      null,
      [Validators.required],
    ),
    montoPorDia: this.fb.control<number | null>(null, [Validators.min(0)]),
    razon: this.fb.control<string>(''),

    fechaInicio: this.fb.control<string>('', [Validators.required]),
    fechaFin: this.fb.control<string | null>(null),
    esIndefinido: this.fb.control<boolean>(true),

    observaciones: this.fb.control<string>(''),
    marcarComoAlquilado: this.fb.control<boolean>(true),

    vehiculos: this.fb.array([], [Validators.required]),
  });

  get vehiculosFormArray() {
    return this.form.get('vehiculos') as FormArray;
  }

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          clienteId: data.clienteId,
          montoPorDia: data.montoPorDia != null ? Number(data.montoPorDia) : null,
          razon: data.razon || '',
          fechaInicio: new Date(data.fechaInicio).toISOString().split('T')[0],
          fechaFin: data.fechaFin ? new Date(data.fechaFin).toISOString().split('T')[0] : null,
          esIndefinido: !!data.esIndefinido,
          observaciones: data.observaciones || '',
        });

        // Limpiar y cargar vehículos
        this.vehiculosFormArray.clear();
        if (data.detalles) {
          data.detalles.forEach((det) => {
            this.addVehiculo(det);
          });
        }
      } else {
        // Al menos uno si es nuevo
        if (this.vehiculosFormArray.length === 0) {
          this.addVehiculo();
        }
      }
    });
  }

  ngOnInit() {
    this.form.get('esIndefinido')?.valueChanges.subscribe((indefinido) => {
      const fechaFinControl = this.form.get('fechaFin');
      if (indefinido) {
        fechaFinControl?.disable();
        fechaFinControl?.setValue(null);
      } else {
        fechaFinControl?.enable();
      }
      this.checkAllAvailability();
    });

    // Estado inicial
    if (this.form.get('esIndefinido')?.value) {
      this.form.get('fechaFin')?.disable();
    }

    this.form.get('fechaInicio')?.valueChanges.subscribe(() => {
      this.checkAllAvailability();
    });

    this.form.get('fechaFin')?.valueChanges.subscribe(() => {
      this.checkAllAvailability();
    });
  }

  addVehiculo(data?: AlquilerDetalleResultDto | Partial<AlquilerVehiculoDetalleDto>) {
    const vehiculoGroup = this.fb.group({
      vehiculoId: this.fb.control<number | ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(
        data?.vehiculoId || null,
        [Validators.required],
      ),
      tipo: this.fb.control<string>(data?.tipo || 'maquina_seca', [Validators.required]),
      conductorId: this.fb.control<number | ApiResponse<'conductores', 'findAll'>['data'][number] | null>(
        data?.conductorId || null,
      ),
      kilometrajeInicial: this.fb.control<number | null>(
        data?.kilometrajeInicial != null ? Number(data.kilometrajeInicial) : null,
        [Validators.required, Validators.min(0)],
      ),
    });

    // Validar conductor según tipo
    const typeControl = vehiculoGroup.get('tipo');
    const conductorControl = vehiculoGroup.get('conductorId');

    // Estado inicial
    const initialTipo = data?.tipo || 'maquina_seca';
    if (initialTipo === 'maquina_seca') {
      conductorControl?.disable();
    } else {
      conductorControl?.setValidators([Validators.required]);
      conductorControl?.updateValueAndValidity();
    }

    typeControl?.valueChanges.subscribe((tipo) => {
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

    // Auto-completar KM y validar disponibilidad
    vehiculoGroup.get('vehiculoId')?.valueChanges.subscribe((vehiculo) => {
      const idx = this.vehiculosFormArray.controls.indexOf(vehiculoGroup);
      if (idx !== -1) this.checkAvailability(idx);

      if (vehiculo && typeof vehiculo === 'object' && 'kilometraje' in vehiculo) {
        const km = (vehiculo as any).kilometraje;
        if (km != null) {
          vehiculoGroup.patchValue({ kilometrajeInicial: Number(km) });
        }
      }
    });

    this.vehiculosFormArray.push(vehiculoGroup);
  }

  checkAllAvailability() {
    for (let i = 0; i < this.vehiculosFormArray.length; i++) {
      this.checkAvailability(i);
    }
  }

  removeVehiculo(index: number) {
    if (this.vehiculosFormArray.length > 1) {
      this.vehiculosFormArray.removeAt(index);
      this.vehiculoValidacionMsg.set({});
      this.checkAllAvailability();
    }
  }

  checkAvailability(index: number) {
    if (this.checkAvailabilityTimeout) clearTimeout(this.checkAvailabilityTimeout);

    this.checkAvailabilityTimeout = setTimeout(() => {
      const group = this.vehiculosFormArray.at(index) as FormGroup;
      const vehiculoId = this.resolveEntityId(group.get('vehiculoId')?.value);
      const fechaInicio = this.form.get('fechaInicio')?.value;
      const esIndefinido = this.form.get('esIndefinido')?.value;

      if (!vehiculoId || !fechaInicio) {
        this.updateValidationMsg(index, null);
        return;
      }

      // Si es indefinido, usamos la fecha de inicio como fin para la validación (al menos que sea vigente hoy)
      const fechaFin = esIndefinido ? fechaInicio : this.form.get('fechaFin')?.value;

      this.alquilerService
        .validarVehiculo({
          vehiculoId,
          fechaInicio: new Date(fechaInicio).toISOString(),
          fechaFin: fechaFin ? new Date(fechaFin).toISOString() : undefined,
          alquilerId: this.initialData()?.id,
        })
        .then((res) => this.updateValidationMsg(index, res))
        .catch(() => this.updateValidationMsg(index, null));
    }, 400);
  }

  private updateValidationMsg(index: number, msg: ApiResponse<'alquileres', 'validarVehiculo'> | null) {
    const current = this.vehiculoValidacionMsg();
    this.vehiculoValidacionMsg.set({ ...current, [index]: msg });
  }

  getValidationMsg(index: number) {
    return this.vehiculoValidacionMsg()[index];
  }

  private toastService = inject(ToastService);

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    // Verificar mensajes de validación de vehículos (ahora solo informativos, no bloquean)
    const validaciones = Object.values(this.vehiculoValidacionMsg());
    const errorMsg = validaciones.find(v => v && !v.status);
    if (errorMsg) {
      // this.toastService.error(errorMsg.message);
    }

    const rawValue = this.form.getRawValue();
    const clienteId = this.resolveEntityId(rawValue.clienteId);

    if (!clienteId) {
      this.toastService.warning('Debe seleccionar un cliente válido');
      return;
    }

    const vehiculos = ((rawValue.vehiculos as any[]) || []).map((v) => ({
      vehiculoId: this.resolveEntityId(v.vehiculoId)!,
      tipo: v.tipo as 'maquina_seca' | 'maquina_operada',
      conductorId: v.tipo === 'maquina_operada' ? this.resolveEntityId(v.conductorId) : undefined,
      kilometrajeInicial: Number(v.kilometrajeInicial || 0),
    }));

    const payload: ApiBody<'alquileres', 'create'> = {
      clienteId,
      montoPorDia: Number(rawValue.montoPorDia),
      razon: rawValue.razon || undefined,
      fechaInicio: new Date(String(rawValue.fechaInicio)).toISOString(),
      fechaFin: rawValue.fechaFin ? new Date(String(rawValue.fechaFin)).toISOString() : undefined,
      esIndefinido: !!rawValue.esIndefinido,
      observaciones: rawValue.observaciones || undefined,
      vehiculos,
      marcarComoAlquilado: !!rawValue.marcarComoAlquilado,
    };

    this.onSubmitForm.emit(payload);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isVehiculoFieldInvalid(index: number, fieldName: string): boolean {
    const group = this.vehiculosFormArray.at(index);
    const field = group.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  private resolveEntityId(value: number | { id: number } | string | null | undefined): number | undefined {
    if (value == null) return undefined;
    const id = typeof value === 'object' ? value.id : value;
    return Number.isFinite(Number(id)) ? Number(id) : undefined;
  }
}
