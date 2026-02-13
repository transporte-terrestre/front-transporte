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
import { RutaCircuitoInputSearch } from '@module/admin/content/rutas/layout/ruta-circuito-input-search/ruta-circuito-input-search';
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
    RutaCircuitoInputSearch,
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
  onSubmitForm = output<any>();
  onDataChange = output<void>();

  // Signals
  tipoViaje = signal<'ida' | 'vuelta' | 'ambos'>('ida');

  // Catálogos
  loadingCatalogos = signal(false);

  viajeForm: FormGroup = this.fb.group({
    cliente: [null, [Validators.required]],
    tipoRuta: ['fija' as ApiResponse<'viajes', 'findOne'>['tipoRuta'], [Validators.required]],
    ruta: [null, [Validators.required]],
    rutaOcasional: [''],
    distanciaEstimada: ['', [Validators.required]],
    distanciaEstimadaVuelta: [''], // Para la vuelta
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
    fechaSalidaVuelta: [''], // Para la vuelta
    fechaLlegadaVuelta: [''], // Para la vuelta
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
          ruta: viajeData.rutaId, // Aquí se debe cargar la ruta actual, aunque el input search espera circuito.
          // TODO: Para edición real, deberíamos obtener el circuito al que pertenece la ruta si queremos mostrarlo en el input search.
          // Por ahora, si es edición, mantenemos la lógica pero el input search podría no mostrar nada si solo tiene rutaId.
          // Asumiremos que para "Refinar" es principalmente CREACIÓN lo que piden.
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
          // En edit mode, NO seteamos campos de vuelta extras porque editamos UN solo viaje a la vez
          fechaSalidaVuelta: '',
          fechaLlegadaVuelta: '',
          distanciaEstimadaVuelta: '',
        });

        // Sincronizar tipoViaje con el sentido actual para evitar sobrescribirlo erróneamente al guardar
        if (viajeData.sentido === 'vuelta') {
          this.tipoViaje.set('vuelta');
        } else {
          this.tipoViaje.set('ida');
        }

        // Aplicar estado de distanciaFinal después de cargar datos
        this.updateDistanciaFinalState(viajeData.estado);
      } else {
        this.viajeForm.reset({
          estado: 'programado',
          tipoRuta: 'fija',
          modalidadServicio: 'regular',
          turno: 'dia',
          sentido: 'ida',
          tipoViaje: 'ida',
          // Resetear nuevos campos
          fechaSalidaVuelta: '',
          fechaLlegadaVuelta: '',
          distanciaEstimadaVuelta: '',
        });
        this.tipoViaje.set('ida');
        // Desactivar distanciaFinal por defecto (estado = programado)
        this.updateDistanciaFinalState('programado');
      }
    });

    // Efecto para validadores de campos de vuelta
    effect(() => {
      const tipo = this.tipoViaje();
      const fSalidaV = this.viajeForm.get('fechaSalidaVuelta');
      const fLlegadaV = this.viajeForm.get('fechaLlegadaVuelta');
      const distV = this.viajeForm.get('distanciaEstimadaVuelta');

      if (tipo === 'ambos' && !this.editMode()) {
        fSalidaV?.setValidators([Validators.required]);
        fLlegadaV?.setValidators([Validators.required]);
        distV?.setValidators([Validators.required]);
      } else {
        fSalidaV?.clearValidators();
        fLlegadaV?.clearValidators();
        distV?.clearValidators();
        // Opcional: limpiar valores si no se usa
        // fSalidaV?.setValue('');
        // fLlegadaV?.setValue('');
      }
      fSalidaV?.updateValueAndValidity();
      fLlegadaV?.updateValueAndValidity();
      distV?.updateValueAndValidity();
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

    // Escuchar cambios en ruta (Circuito) para setear distancias
    this.viajeForm.get('ruta')?.valueChanges.subscribe((circuito) => {
      if (
        circuito &&
        typeof circuito === 'object' &&
        this.viajeForm.get('tipoRuta')?.value === 'fija'
      ) {
        const c = circuito as any;
        const tipo = this.tipoViaje();

        // 1. Setear distancia normal (Ida o única)
        let dist = '';
        if (tipo === 'ida' && c.rutaIda) dist = c.rutaIda.distancia;
        else if (tipo === 'vuelta' && c.rutaVuelta) dist = c.rutaVuelta.distancia;
        else if (tipo === 'ambos' && c.rutaIda) dist = c.rutaIda.distancia; // En ambos mapemos ida al normal

        if (dist) {
          this.viajeForm.patchValue({ distanciaEstimada: dist });
        }

        // 2. Setear distancia vuelta (si es ambos)
        if (tipo === 'ambos' && c.rutaVuelta) {
          this.viajeForm.patchValue({ distanciaEstimadaVuelta: c.rutaVuelta.distancia });
        }
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
    const basePayload = {
      ...formValue,
      rutaOcasional: formValue.rutaOcasional || undefined,
      distanciaEstimada: formValue.distanciaEstimada || undefined,
      distanciaFinal: formValue.distanciaFinal || undefined,
      horasContrato: formValue.horasContrato || undefined,
      tipoRuta: formValue.tipoRuta || 'fija',
      modalidadServicio: formValue.modalidadServicio || 'regular',
      estado: formValue.estado || 'programado',
      turno: formValue.turno || 'dia',
      // Sentido se sobreescribirá si es fijo
      sentido: formValue.sentido || 'ida',

      vehiculoId: formValue.vehiculo?.id
        ? Number(formValue.vehiculo.id)
        : Number(formValue.vehiculo),
      conductorId: formValue.conductor?.id
        ? Number(formValue.conductor.id)
        : Number(formValue.conductor),
      clienteId: formValue.cliente?.id ? Number(formValue.cliente.id) : Number(formValue.cliente),

      // Fecha normal (se usará para ida o único)
      fechaSalida: formValue.fechaSalida ? `${formValue.fechaSalida}:00.000Z` : '',
      fechaLlegada: formValue.fechaLlegada ? `${formValue.fechaLlegada}:00.000Z` : undefined,

      ruta: undefined,
      vehiculo: undefined,
      conductor: undefined,
      cliente: undefined,
      // Limpiar campos extras del form value
      fechaSalidaVuelta: undefined,
      fechaLlegadaVuelta: undefined,
      distanciaEstimadaVuelta: undefined,
    };

    if (formValue.tipoRuta === 'fija' && formValue.ruta && typeof formValue.ruta === 'object') {
      const circuito = formValue.ruta as any;
      const tipo = this.tipoViaje();

      if (tipo === 'ambos') {
        const payloads = [];
        // Ida
        if (circuito.rutaIda) {
          payloads.push({
            ...basePayload,
            rutaId: circuito.rutaIda.id,
            sentido: 'ida',
            // Usa fechaSalida/Llegada y distanciaEstimada normales
            distanciaEstimada: formValue.distanciaEstimada || circuito.rutaIda.distancia,
          });
        }
        // Vuelta
        if (circuito.rutaVuelta) {
          payloads.push({
            ...basePayload,
            rutaId: circuito.rutaVuelta.id,
            sentido: 'vuelta',
            // Usar fechas y distancia de vuelta
            fechaSalida: formValue.fechaSalidaVuelta
              ? `${formValue.fechaSalidaVuelta}:00.000Z`
              : '',
            fechaLlegada: formValue.fechaLlegadaVuelta
              ? `${formValue.fechaLlegadaVuelta}:00.000Z`
              : undefined,
            distanciaEstimada: formValue.distanciaEstimadaVuelta || circuito.rutaVuelta.distancia,
          });
        }
        this.onSubmitForm.emit(payloads);
      } else {
        // Solo ida o solo vuelta
        let rutaId = null;
        let sentido = 'ida';
        if (tipo === 'ida' && circuito.rutaIda) {
          rutaId = circuito.rutaIda.id;
          sentido = 'ida';
        } else if (tipo === 'vuelta' && circuito.rutaVuelta) {
          rutaId = circuito.rutaVuelta.id;
          sentido = 'vuelta';
        }

        if (rutaId) {
          this.onSubmitForm.emit({
            ...basePayload,
            rutaId,
            sentido,
          });
        } else {
          // Fallback o error si seleccionó un sentido que el circuito no tiene
          console.error('El circuito seleccionado no tiene la ruta para el sentido escogido');
        }
      }
    } else {
      // Caso Ocasional o Edición (donde ruta podría ser ID)
      this.onSubmitForm.emit({
        ...basePayload,
        rutaId: formValue.ruta?.id
          ? Number(formValue.ruta.id)
          : Number(formValue.ruta) || undefined,
      });
    }
  }
}
