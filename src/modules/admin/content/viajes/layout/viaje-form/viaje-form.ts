import { Component, inject, input, output, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ClienteInputSearch } from '@module/admin/content/clientes/layout/cliente-input-search/cliente-input-search';
import { RutaInputSearch } from '@module/admin/content/rutas/layout/ruta-input-search/ruta-input-search';
import { VehiculoInputSearch } from '@module/admin/content/vehiculos/layout/vehiculo-input-search/vehiculo-input-search';
import { ConductorInputSearch } from '@module/admin/content/conductores/layout/conductor-input-search/conductor-input-search';
import { ViajeConductoresForm } from './content/viaje-conductores-form/viaje-conductores-form';
import { ViajeVehiculosForm } from './content/viaje-vehiculos-form/viaje-vehiculos-form';
import { ViajeComentariosForm } from './content/viaje-comentarios-form/viaje-comentarios-form';
import { ViajeServiciosFormComponent } from './content/viaje-servicios-form/viaje-servicios-form';
import { ViajePasajerosForm } from './content/viaje-pasajeros-form/viaje-pasajeros-form';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-viaje-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteInputSearch,
    RutaInputSearch,
    VehiculoInputSearch,
    ConductorInputSearch,
    ViajeConductoresForm,
    ViajeVehiculosForm,
    ViajePasajerosForm,
    ViajeComentariosForm,
    ViajeServiciosFormComponent,
  ],
  templateUrl: './viaje-form.html',
  styleUrl: './viaje-form.css',
})
export class ViajeForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  viaje = input<
    | (ApiResponse<'viajes', 'findOne'> & {
        conductorPrincipal?: NonNullable<ApiResponse<'viajes', 'findOne'>['conductores']>[number];
        vehiculoPrincipal?: NonNullable<ApiResponse<'viajes', 'findOne'>['vehiculos']>[number];
      })
    | null
  >(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'viajes', 'create'> | ApiBody<'viajes', 'update'>>();
  onDataChange = output<void>();

  // Catálogos
  loadingCatalogos = signal(false);

  viajeForm: FormGroup = this.fb.group({
    cliente: [null, [Validators.required]],
    tipoRuta: ['fija' as ApiResponse<'viajes', 'findOne'>['tipoRuta'], [Validators.required]],
    ruta: [null, [Validators.required]],
    rutaOcasional: [''],
    distanciaEstimada: ['', [Validators.required]],
    distanciaFinal: [{ value: '', disabled: true }],
    horasContrato: [''],
    modalidadServicio: [
      'regular' as ApiResponse<'viajes', 'findOne'>['modalidadServicio'],
      [Validators.required],
    ],
    vehiculo: [null, [Validators.required]],
    conductor: [null, [Validators.required]],
    fechaSalida: ['', [Validators.required]],
    fechaLlegada: ['', [Validators.required]],
    estado: ['programado' as ApiResponse<'viajes', 'findOne'>['estado'], [Validators.required]],
    turno: ['dia' as ApiResponse<'viajes', 'findOne'>['turno'], [Validators.required]],
    sentido: ['ida' as ApiResponse<'viajes', 'findOne'>['sentido'], [Validators.required]],
  });

  estados: Array<{
    value: ApiResponse<'viajes', 'findOne'>['estado'];
    label: string;
    icon: string;
    color: string;
  }> = [
    { value: 'programado', label: 'Programado', icon: 'fa-calendar', color: 'text-primary' },
    { value: 'en_progreso', label: 'En Progreso', icon: 'fa-truck', color: 'text-warning' },
    { value: 'completado', label: 'Completado', icon: 'fa-check-circle', color: 'text-success' },
    { value: 'cancelado', label: 'Cancelado', icon: 'fa-times-circle', color: 'text-danger' },
  ];

  tiposRuta: Array<{ value: string; label: string; color: string }> = [
    { value: 'fija', label: 'Fija', color: 'text-primary' },
    { value: 'ocasional', label: 'Ocasional', color: 'text-info' },
  ];

  modalidades: Array<{
    value: ApiResponse<'viajes', 'findOne'>['modalidadServicio'];
    label: string;
    icon: string;
    color: string;
  }> = [
    { value: 'regular', label: 'Regular', icon: 'fa-bus', color: 'text-text/70' },
    { value: 'expreso', label: 'Expreso', icon: 'fa-shipping-fast', color: 'text-warning' },
    { value: 'ejecutivo', label: 'Ejecutivo', icon: 'fa-briefcase', color: 'text-primary' },
    { value: 'especial', label: 'Especial', icon: 'fa-star', color: 'text-secondary' },
    { value: 'turismo', label: 'Turismo', icon: 'fa-camera', color: 'text-success' },
    { value: 'corporativo', label: 'Corporativo', icon: 'fa-briefcase', color: 'text-primary' },
  ];

  turnos: Array<{
    value: NonNullable<ApiResponse<'viajes', 'findOne'>['turno']>;
    label: string;
    icon: string;
  }> = [
    { value: 'dia', label: 'Día', icon: 'fa-sun' },
    { value: 'noche', label: 'Noche', icon: 'fa-moon' },
  ];

  sentidos: Array<{
    value: ApiResponse<'viajes', 'findOne'>['sentido'];
    label: string;
    icon: string;
  }> = [
    { value: 'ida', label: 'Ida', icon: 'fa-arrow-right' },
    { value: 'vuelta', label: 'Vuelta', icon: 'fa-arrow-left' },
  ];

  constructor() {
    effect(() => {
      const viajeData = this.viaje();
      const isEditMode = this.editMode();

      if (isEditMode && viajeData) {
        this.viajeForm.patchValue({
          cliente: viajeData.clienteId,
          tipoRuta: viajeData.tipoRuta,
          ruta: viajeData.rutaId,
          rutaOcasional: viajeData.rutaOcasional,
          distanciaEstimada: viajeData.distanciaEstimada || '',
          distanciaFinal: viajeData.distanciaFinal || '',
          modalidadServicio: viajeData.modalidadServicio,
          vehiculo: viajeData.vehiculoPrincipal?.id,
          conductor: viajeData.conductorPrincipal?.id,
          horasContrato: viajeData.horasContrato,
          fechaSalida: this.formatDateTimeForInput(viajeData.fechaSalida),
          fechaLlegada: viajeData.fechaLlegada
            ? this.formatDateTimeForInput(viajeData.fechaLlegada)
            : '',
          estado: viajeData.estado,
          turno: viajeData.turno,
          sentido: viajeData.sentido,
        });

        // Aplicar estado de distanciaFinal después de cargar datos
        this.updateDistanciaFinalState(viajeData.estado);
      } else {
        this.viajeForm.reset({
          estado: 'programado',
          tipoRuta: 'fija',
          modalidadServicio: 'regular',
          turno: 'dia',
          sentido: 'ida',
        });
        // Desactivar distanciaFinal por defecto (estado = programado)
        this.updateDistanciaFinalState('programado');
      }
    });

    // Auto-set horasContrato based on Cliente
    this.viajeForm.get('cliente')?.valueChanges.subscribe((cliente) => {
      if (cliente && typeof cliente === 'object') {
        const clienteData = cliente as { horasContrato?: number };
        if (clienteData.horasContrato !== undefined) {
          this.viajeForm.patchValue({
            horasContrato: clienteData.horasContrato,
          });
        }
      } else {
        this.viajeForm.patchValue({
          horasContrato: '',
        });
      }
    });
  }

  ngOnInit() {
    // Validaciones condicionales para ruta
    this.viajeForm.get('tipoRuta')?.valueChanges.subscribe((tipo) => {
      const rutaControl = this.viajeForm.get('ruta');
      const rutaOcasionalControl = this.viajeForm.get('rutaOcasional');
      const distanciaEstimadaControl = this.viajeForm.get('distanciaEstimada');

      if (tipo === 'fija') {
        rutaControl?.setValidators([Validators.required]);
        rutaOcasionalControl?.clearValidators();
        rutaOcasionalControl?.setValue('');
        // La distancia se seteará automáticamente al seleccionar la ruta
      } else {
        rutaOcasionalControl?.setValidators([Validators.required]);
        rutaControl?.clearValidators();
        rutaControl?.setValue(null);
        // Limpiar distancia para que el usuario la ingrese manualmente
        distanciaEstimadaControl?.setValue('');
      }
      rutaControl?.updateValueAndValidity();
      rutaOcasionalControl?.updateValueAndValidity();
    });

    // Escuchar cambios en ruta para setear la distancia automáticamente (cuando es ruta fija)
    this.viajeForm.get('ruta')?.valueChanges.subscribe((ruta) => {
      if (ruta && typeof ruta === 'object' && this.viajeForm.get('tipoRuta')?.value === 'fija') {
        const rutaData = ruta as { distancia?: string };
        this.viajeForm.patchValue({
          distanciaEstimada: rutaData.distancia || '',
        });
      }
    });

    // Control de distanciaFinal basado en estado
    this.viajeForm.get('estado')?.valueChanges.subscribe((estado) => {
      this.updateDistanciaFinalState(estado);
    });

    // Aplicar estado inicial
    this.updateDistanciaFinalState(this.viajeForm.get('estado')?.value);
  }

  updateDistanciaFinalState(estado: string | null | undefined) {
    const distanciaFinalControl = this.viajeForm.get('distanciaFinal');

    if (estado === 'completado') {
      distanciaFinalControl?.enable();
      distanciaFinalControl?.setValidators([Validators.required]);
    } else {
      distanciaFinalControl?.disable();
      distanciaFinalControl?.setValue('');
      distanciaFinalControl?.clearValidators();
    }
    distanciaFinalControl?.updateValueAndValidity();
  }

  formatDateTimeForInput(date: Date | string): string {
    // Si es string y parece formato ISO, cortar para preservar la hora "tal cual" del JSON/Backend
    if (typeof date === 'string' && date.indexOf('T') > -1) {
      return date.substring(0, 16);
    }

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submitForm() {
    if (this.viajeForm.invalid) {
      this.viajeForm.markAllAsTouched();
      return;
    }

    const formValue = this.viajeForm.value;

    const formData: ApiBody<'viajes', 'create'> = {
      ...formValue,
      rutaOcasional: formValue.rutaOcasional || undefined,
      distanciaEstimada: formValue.distanciaEstimada || undefined,
      distanciaFinal: formValue.distanciaFinal || undefined,
      horasContrato: formValue.horasContrato || undefined,
      tipoRuta: formValue.tipoRuta || 'fija',
      modalidadServicio: formValue.modalidadServicio || 'regular',
      estado: formValue.estado || 'programado',
      turno: formValue.turno || 'dia',
      sentido: formValue.sentido || 'ida',

      rutaId: formValue.ruta?.id ? Number(formValue.ruta.id) : Number(formValue.ruta),
      vehiculoId: formValue.vehiculo?.id
        ? Number(formValue.vehiculo.id)
        : Number(formValue.vehiculo),
      conductorId: formValue.conductor?.id
        ? Number(formValue.conductor.id)
        : Number(formValue.conductor),
      clienteId: formValue.cliente?.id ? Number(formValue.cliente.id) : Number(formValue.cliente),

      fechaSalida: formValue.fechaSalida ? `${formValue.fechaSalida}:00.000Z` : '',
      fechaLlegada: formValue.fechaLlegada ? `${formValue.fechaLlegada}:00.000Z` : undefined,

      ruta: undefined,
      vehiculo: undefined,
      conductor: undefined,
      cliente: undefined,
    };

    this.onSubmitForm.emit(formData);
  }
}
