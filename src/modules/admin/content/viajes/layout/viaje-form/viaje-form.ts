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
import { ToastService } from '@service/toast.service';
import { ClienteInputSearch } from '@module/admin/content/clientes/layout/cliente-input-search/cliente-input-search';
import { RutaCircuitoInputSearch } from '@module/admin/content/rutas/layout/ruta-circuito-input-search/ruta-circuito-input-search';
import { VehiculoInputSearch } from '@module/admin/content/vehiculos/layout/vehiculo-input-search/vehiculo-input-search';
import { ConductorInputSearch } from '@module/admin/content/conductores/layout/conductor-input-search/conductor-input-search';
import { ViajeConductoresForm } from './layout/viaje-conductores-form/viaje-conductores-form';
import { ViajeVehiculosForm } from './layout/viaje-vehiculos-form/viaje-vehiculos-form';
import { ViajeComentariosForm } from './layout/viaje-comentarios-form/viaje-comentarios-form';
import { RutaInputSearch } from '@module/admin/content/rutas/layout/ruta-input-search/ruta-input-search';
import { ViajeServiciosFormComponent } from './layout/viaje-servicios-form/viaje-servicios-form';
import { ViajePasajerosForm } from './layout/viaje-pasajeros-form/viaje-pasajeros-form';
import { FormGroup } from '@angular/forms';

interface CircuitoSelection {
  rutaIda?: { id: number; distancia: string };
  rutaVuelta?: { id: number; distancia: string };
}

@Component({
  selector: 'app-viaje-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteInputSearch,
    RutaCircuitoInputSearch,
    VehiculoInputSearch,
    ConductorInputSearch,
    RutaInputSearch,
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
  private toastService = inject(ToastService);

  // Inputs
  viaje = input<ApiResponse<'viajes', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'viajes', 'create'> | ApiBody<'viajes', 'create'>[]>();
  onUpdate = output<ApiBody<'viajes', 'update'>>();
  onDataChange = output<void>();

  // Signals
  tipoViaje = signal<'ida' | 'vuelta' | 'ambos'>('ida');
  hasRutaIda = signal<boolean>(false);
  hasRutaVuelta = signal<boolean>(false);
  hasRutaSelected = signal<boolean>(false);

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
    modalidadServicioVuelta: ['regular' as ApiResponse<'viajes', 'findOne'>['modalidadServicio']],
    vehiculo: [null, [Validators.required]],
    conductor: [null, [Validators.required]],
    fechaSalidaDate: [this.getTodayDate(), [Validators.required]],
    fechaSalidaTime: ['10:00', [Validators.required]],
    fechaLlegadaDate: [this.getTodayDate(), [Validators.required]],
    fechaLlegadaTime: ['14:00', [Validators.required]],
    fechaSalidaVueltaDate: [this.getTodayDate()],
    fechaSalidaVueltaTime: ['10:00'],
    fechaLlegadaVueltaDate: [this.getTodayDate()],
    fechaLlegadaVueltaTime: ['14:00'],
    estado: ['programado' as ApiResponse<'viajes', 'findOne'>['estado'], [Validators.required]],
    estadoVuelta: ['programado' as ApiResponse<'viajes', 'findOne'>['estado']],
    turno: ['dia' as ApiResponse<'viajes', 'findOne'>['turno'], [Validators.required]],
    turnoVuelta: ['dia' as ApiResponse<'viajes', 'findOne'>['turno']],
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
          vehiculo: viajeData.vehiculos?.[0].id,
          conductor: viajeData.conductores?.[0].id,
          horasContrato: viajeData.horasContrato,
          fechaSalidaDate: viajeData.fechaSalida ? this.extractDate(viajeData.fechaSalida) : '',
          fechaSalidaTime: viajeData.fechaSalida ? this.extractTime(viajeData.fechaSalida) : '',
          fechaLlegadaDate: viajeData.fechaLlegada ? this.extractDate(viajeData.fechaLlegada) : '',
          fechaLlegadaTime: viajeData.fechaLlegada ? this.extractTime(viajeData.fechaLlegada) : '',
          estado: viajeData.estado,
          turno: viajeData.turno,
          sentido: viajeData.sentido,
          // En edit mode, NO seteamos campos de vuelta extras porque editamos UN solo viaje a la vez
          fechaSalidaVueltaDate: '',
          fechaSalidaVueltaTime: '',
          fechaLlegadaVueltaDate: '',
          fechaLlegadaVueltaTime: '',
          distanciaEstimadaVuelta: '',
        });

        // Sincronizar tipoViaje con el sentido actual para evitar sobrescribirlo erróneamente al guardar
        if (viajeData.sentido === 'vuelta') {
          this.tipoViaje.set('vuelta');
        } else {
          this.tipoViaje.set('ida');
        }

        // En edit mode, los vehículos y conductores se gestionan por separado
        this.viajeForm.get('vehiculo')?.clearValidators();
        this.viajeForm.get('conductor')?.clearValidators();
        this.viajeForm.get('vehiculo')?.updateValueAndValidity();
        this.viajeForm.get('conductor')?.updateValueAndValidity();

        // Aplicar estado de distanciaFinal después de cargar datos
        this.updateDistanciaFinalState(viajeData.estado);
      } else {
        // En create mode, son requeridos
        this.viajeForm.get('vehiculo')?.setValidators([Validators.required]);
        this.viajeForm.get('conductor')?.setValidators([Validators.required]);
        this.viajeForm.get('vehiculo')?.updateValueAndValidity();
        this.viajeForm.get('conductor')?.updateValueAndValidity();

        this.viajeForm.reset({
          modalidadServicio: 'regular',
          turno: 'dia',
          sentido: 'ida',
          tipoViaje: 'ida',
          estado: 'programado',
          estadoVuelta: 'programado',
          tipoRuta: 'fija',
          // Resetear nuevos campos con defaults
          fechaSalidaDate: this.getTodayDate(),
          fechaSalidaTime: '10:00',
          fechaLlegadaDate: this.getTodayDate(),
          fechaLlegadaTime: '14:00',
          fechaSalidaVueltaDate: this.getTodayDate(),
          fechaSalidaVueltaTime: '10:00',
          fechaLlegadaVueltaDate: this.getTodayDate(),
          fechaLlegadaVueltaTime: '14:00',
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
      const fSalidaVDate = this.viajeForm.get('fechaSalidaVueltaDate');
      const fSalidaVTime = this.viajeForm.get('fechaSalidaVueltaTime');
      const fLlegadaVDate = this.viajeForm.get('fechaLlegadaVueltaDate');
      const fLlegadaVTime = this.viajeForm.get('fechaLlegadaVueltaTime');
      const distV = this.viajeForm.get('distanciaEstimadaVuelta');
      const circuito = this.viajeForm.get('ruta')?.value;

      // 1. Sincronización de Distancias dependiendo del tipo de viaje
      if (circuito && typeof circuito === 'object' && !this.editMode()) {
        const c = circuito as CircuitoSelection;
        if (tipo === 'ida' && c.rutaIda) {
          this.viajeForm.patchValue({ distanciaEstimada: c.rutaIda.distancia });
        } else if (tipo === 'vuelta' && c.rutaVuelta) {
          this.viajeForm.patchValue({ distanciaEstimada: c.rutaVuelta.distancia });
        } else if (tipo === 'ambos') {
          if (c.rutaIda) this.viajeForm.patchValue({ distanciaEstimada: c.rutaIda.distancia });
          if (c.rutaVuelta) {
            this.viajeForm.patchValue({ distanciaEstimadaVuelta: c.rutaVuelta.distancia });
          }
        }
      }

      // 2. Validadores y lógica específica de "Ambos"
      if (tipo === 'ambos' && !this.editMode()) {
        fSalidaVDate?.setValidators([Validators.required]);
        fSalidaVTime?.setValidators([Validators.required]);
        fLlegadaVDate?.setValidators([Validators.required]);
        fLlegadaVTime?.setValidators([Validators.required]);
        distV?.setValidators([Validators.required]);

        // Sincronizar Modalidad y Turno de Ida a Vuelta
        const currentModalidad = this.viajeForm.get('modalidadServicio')?.value;
        const currentTurno = this.viajeForm.get('turno')?.value;
        this.viajeForm.patchValue(
          {
            modalidadServicioVuelta: currentModalidad,
            turnoVuelta: currentTurno,
          },
          { emitEvent: false },
        );
      } else {
        fSalidaVDate?.clearValidators();
        fSalidaVTime?.clearValidators();
        fLlegadaVDate?.clearValidators();
        fLlegadaVTime?.clearValidators();
        distV?.clearValidators();
      }
      fSalidaVDate?.updateValueAndValidity();
      fSalidaVTime?.updateValueAndValidity();
      fLlegadaVDate?.updateValueAndValidity();
      fLlegadaVTime?.updateValueAndValidity();
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

        // Distancia requerida para fija (se llena auto)
        distanciaEstimadaControl?.setValidators([Validators.required]);
      } else {
        rutaOcasionalControl?.setValidators([Validators.required]);
        rutaControl?.clearValidators();
        rutaControl?.setValue(null);

        // Limpiar distancia y MANTENER validador para ocasional (requerido)
        distanciaEstimadaControl?.setValue('');
        // distanciaEstimada no se le hace clearValidators(), sigue siendo required
      }
      rutaControl?.updateValueAndValidity();
      rutaOcasionalControl?.updateValueAndValidity();
      distanciaEstimadaControl?.updateValueAndValidity();
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

        // Actualizar señales de rutas disponibles
        this.hasRutaIda.set(!!c.rutaIda);
        this.hasRutaVuelta.set(!!c.rutaVuelta);
        this.hasRutaSelected.set(true);

        // Auto-seleccionar tipo de viaje según rutas disponibles
        if (c.rutaIda && c.rutaVuelta) {
          // Tiene ambas, dejar la selección actual o 'ida' por defecto
        } else if (c.rutaIda && !c.rutaVuelta) {
          this.tipoViaje.set('ida');
        } else if (!c.rutaIda && c.rutaVuelta) {
          this.tipoViaje.set('vuelta');
        }

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
      } else {
        // Circuito deseleccionado
        this.hasRutaIda.set(false);
        this.hasRutaVuelta.set(false);
        this.hasRutaSelected.set(false);
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

  getTodayDate(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTodayAtTime(hours: number, minutes: number = 0): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${year}-${month}-${day}T${hh}:${mm}`;
  }

  // Helpers para extraer Date y Time de ISO string
  private extractDate(dateTime: string): string {
    if (!dateTime) return '';
    // Asumimos formato ISO o YYYY-MM-DDTHH:mm
    return dateTime.split('T')[0];
  }

  private extractTime(dateTime: string): string {
    if (!dateTime) return '';
    const timePart = dateTime.split('T')[1];
    if (!timePart) return '';
    // Return HH:mm
    return timePart.substring(0, 5);
  }

  submitForm() {
    if (this.viajeForm.invalid) {
      const controls = this.viajeForm.controls;
      const invalidFields: string[] = [];

      const labels: Record<string, string> = {
        cliente: 'Cliente',
        tipoRuta: 'Tipo de Ruta',
        ruta: 'Ruta / Circuito',
        rutaOcasional: 'Descripción de Ruta',
        distanciaEstimada: 'Km Estimados',
        vehiculo: 'Vehículo',
        conductor: 'Conductor',
        fechaSalidaDate: 'Fecha Salida',
        fechaSalidaTime: 'Hora Salida',
        fechaLlegadaDate: 'Fecha Llegada',
        fechaLlegadaTime: 'Hora Llegada',
        modalidadServicio: 'Modalidad',
        estado: 'Estado',
        turno: 'Turno',
        sentido: 'Sentido',
        fechaSalidaVueltaDate: 'Fecha Salida Vuelta',
        fechaSalidaVueltaTime: 'Hora Salida Vuelta',
        fechaLlegadaVueltaDate: 'Fecha Llegada Vuelta',
        fechaLlegadaVueltaTime: 'Hora Llegada Vuelta',
        distanciaEstimadaVuelta: 'Km Estimados Vuelta',
      };

      Object.keys(controls).forEach((key) => {
        if (controls[key].invalid) {
          invalidFields.push(labels[key] || key);
        }
      });

      this.toastService.warning(`Faltan campos por completar: ${invalidFields.join(', ')}`);
      this.viajeForm.markAllAsTouched();
      return;
    }

    const formValue = this.viajeForm.value;

    // Desestructurar para eliminar campos que no van al backend
    const {
      fechaSalidaDate,
      fechaSalidaTime,
      fechaLlegadaDate,
      fechaLlegadaTime,
      fechaSalidaVueltaDate,
      fechaSalidaVueltaTime,
      fechaLlegadaVueltaDate,
      fechaLlegadaVueltaTime,
      distanciaEstimadaVuelta,
      modalidadServicioVuelta,
      estadoVuelta,
      turnoVuelta,
      vehiculo,
      conductor,
      cliente,
      ruta,
      ...cleanFormValue
    } = formValue;

    const basePayload = {
      ...cleanFormValue,
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
      fechaSalida:
        fechaSalidaDate && fechaSalidaTime ? `${fechaSalidaDate}T${fechaSalidaTime}:00.000Z` : '',
      fechaLlegada:
        fechaLlegadaDate && fechaLlegadaTime
          ? `${fechaLlegadaDate}T${fechaLlegadaTime}:00.000Z`
          : undefined,
    };

    if (
      !this.editMode() &&
      formValue.tipoRuta === 'fija' &&
      formValue.ruta &&
      typeof formValue.ruta === 'object'
    ) {
      const circuito = formValue.ruta as {
        rutaIda?: { id: number; distancia: string };
        rutaVuelta?: { id: number; distancia: string };
      };
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
            fechaSalida:
              formValue.fechaSalidaVueltaDate && formValue.fechaSalidaVueltaTime
                ? `${formValue.fechaSalidaVueltaDate}T${formValue.fechaSalidaVueltaTime}:00.000Z`
                : '',
            fechaLlegada:
              formValue.fechaLlegadaVueltaDate && formValue.fechaLlegadaVueltaTime
                ? `${formValue.fechaLlegadaVueltaDate}T${formValue.fechaLlegadaVueltaTime}:00.000Z`
                : undefined,
            distanciaEstimada: formValue.distanciaEstimadaVuelta || circuito.rutaVuelta.distancia,
            // Override Modalidad / Turno / Estado for Vuelta
            modalidadServicio: formValue.modalidadServicioVuelta || 'regular',
            turno: formValue.turnoVuelta || 'dia',
            estado: formValue.estadoVuelta || 'programado',
          });
        }
        if (this.editMode()) {
          // Edición de viaje existente (solo un objeto permitida)
          console.error('No se puede editar a tipo "ambos" (múltiples viajes)');
          return;
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
          const payload = {
            ...basePayload,
            rutaId,
            sentido,
          };

          if (this.editMode()) {
            this.onUpdate.emit(payload as unknown as ApiBody<'viajes', 'update'>);
          } else {
            this.onSubmitForm.emit(payload);
          }
        } else {
          // Fallback o error si seleccionó un sentido que el circuito no tiene
          console.error('El circuito seleccionado no tiene la ruta para el sentido escogido');
        }
      }
    } else {
      // Caso Ocasional o Edición (donde ruta podría ser ID)
      const payload = {
        ...basePayload,
        rutaId: formValue.ruta?.id
          ? Number(formValue.ruta.id)
          : Number(formValue.ruta) || undefined,
      };

      if (this.editMode()) {
        this.onUpdate.emit(payload as unknown as ApiBody<'viajes', 'update'>);
      } else {
        this.onSubmitForm.emit(payload);
      }
    }
  }
}
