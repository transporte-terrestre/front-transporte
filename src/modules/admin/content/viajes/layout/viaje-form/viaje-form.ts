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
import { ClienteInputSearch } from '@module/admin/components/input-searchs/cliente-input-search/cliente-input-search';
import { RutaCircuitoInputSearch } from '@module/admin/components/input-searchs/ruta-circuito-input-search/ruta-circuito-input-search';
import { VehiculoInputSearch } from '@module/admin/components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { ConductorInputSearch } from '@module/admin/components/input-searchs/conductor-input-search/conductor-input-search';
import { ViajeConductoresForm } from './layout/viaje-conductores-form/viaje-conductores-form';
import { ViajeVehiculosForm } from './layout/viaje-vehiculos-form/viaje-vehiculos-form';
import { ViajeComentariosForm } from './layout/viaje-comentarios-form/viaje-comentarios-form';
import { RutaInputSearch } from '@module/admin/components/input-searchs/ruta-input-search/ruta-input-search';
import { ViajeTramosFormComponent } from './layout/viaje-tramos-form/viaje-tramos-form';
import { ViajePasajerosForm } from './layout/viaje-pasajeros-form/viaje-pasajeros-form';
import { FormGroup } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ClienteService } from '@service/admin/cliente.service';
import { EntidadInputSearch } from '@module/admin/components/input-searchs/entidad-input-search/entidad-input-search';

interface CircuitoSelection {
  rutaIda?: { id: number; distancia: string; tiempoEstimado: number };
  rutaVuelta?: { id: number; distancia: string; tiempoEstimado: number };
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
    ViajeTramosFormComponent,
    EntidadInputSearch,
  ],
  templateUrl: './viaje-form.html',
  styleUrl: './viaje-form.css',
})
export class ViajeForm implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);
  private clienteService = inject(ClienteService);

  // Inputs
  viaje = input<ApiResponse<'viajes', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'viajes', 'create'>>();
  onUpdate = output<ApiBody<'viajes', 'update'>>();
  onDataChange = output<void>();

  private checkAvailabilityTimeout: any;

  // Signals
  tipoViaje = signal<'ida' | 'vuelta' | 'ambos'>('ida');
  hasRutaIda = signal<boolean>(false);
  hasRutaVuelta = signal<boolean>(false);
  hasRutaSelected = signal<boolean>(false);

  // Validation
  vehiculoValidacionMsg = signal<{ status: boolean; message: string } | null>(null);
  conductorValidacionMsg = signal<{ status: boolean; message: string } | null>(null);

  // Catálogos
  loadingCatalogos = signal(false);
  selectedClienteId = signal<number | null>(null);

  viajeForm: FormGroup = this.fb.group({
    cliente: [null, [Validators.required]],
    entidad: [null], // ID de la entidad seleccionada
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
          entidad: viajeData.entidadId || null,
          tipoRuta: viajeData.tipoRuta,
          ruta: viajeData.rutaId,
          rutaOcasional: viajeData.rutaOcasional,
          distanciaEstimada: viajeData.distanciaEstimada || '',
          distanciaFinal: viajeData.distanciaFinal || '',
          modalidadServicio: viajeData.modalidadServicio,
          vehiculo: viajeData.vehiculos?.[0].id,
          conductor: viajeData.conductores?.[0].id,
          horasContrato: viajeData.horasContrato,
          fechaSalidaDate: viajeData.fechaSalidaProgramada
            ? this.extractDate(viajeData.fechaSalidaProgramada)
            : '',
          fechaSalidaTime: viajeData.fechaSalidaProgramada
            ? this.extractTime(viajeData.fechaSalidaProgramada)
            : '',
          fechaLlegadaDate: viajeData.fechaLlegadaProgramada
            ? this.extractDate(viajeData.fechaLlegadaProgramada)
            : '',
          fechaLlegadaTime: viajeData.fechaLlegadaProgramada
            ? this.extractTime(viajeData.fechaLlegadaProgramada)
            : '',
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

        // Ejecutar reconteo de horas
        this.calculateEstimatedTimes();
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

      // Chequeo de disponibilidad cuando conmutamos IDA/VUELTA/AMBOS y los tiempos recalculan
      setTimeout(() => this.checkAvailability(), 100);
    });

    // Auto-set horasContrato based on Cliente and fetch Entidades
    this.viajeForm.get('cliente')?.valueChanges.subscribe(async (cliente) => {
      this.viajeForm.patchValue({ entidad: null }, { emitEvent: false }); // Reset entidad always when cliente changes

      if (cliente && typeof cliente === 'object') {
        const clienteData = cliente as { id?: number; horasContrato?: number };
        this.selectedClienteId.set(clienteData.id || null);
        if (clienteData.horasContrato !== undefined) {
          this.viajeForm.patchValue({
            horasContrato: clienteData.horasContrato,
          });
        }
      } else if (cliente && typeof cliente === 'number') {
        this.selectedClienteId.set(cliente);
        this.viajeForm.patchValue({ horasContrato: '' }, { emitEvent: false });
      } else {
        this.selectedClienteId.set(null);
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

        // 3. Recalcular horas
        this.calculateEstimatedTimes();
      } else {
        // Circuito deseleccionado
        this.hasRutaIda.set(false);
        this.hasRutaVuelta.set(false);
        this.hasRutaSelected.set(false);
      }
    });

    // Suscripciones a los campos de salida para recalcular en caso de cambios manuales
    this.viajeForm.get('fechaSalidaDate')?.valueChanges.subscribe(() => {
      if (this.hasRutaSelected()) this.calculateEstimatedTimes();
    });
    this.viajeForm.get('fechaSalidaTime')?.valueChanges.subscribe(() => {
      if (this.hasRutaSelected()) this.calculateEstimatedTimes();
    });

    // Control de distanciaFinal basado en estado
    this.viajeForm.get('estado')?.valueChanges.subscribe((estado) => {
      this.updateDistanciaFinalState(estado);
    });

    // Suscripciones para endpoints de validación
    const validateKeys = [
      'fechaSalidaDate',
      'fechaSalidaTime',
      'fechaLlegadaDate',
      'fechaLlegadaTime',
      'fechaSalidaVueltaDate',
      'fechaSalidaVueltaTime',
      'fechaLlegadaVueltaDate',
      'fechaLlegadaVueltaTime',
      'vehiculo',
      'conductor',
      'ruta',
    ];
    validateKeys.forEach((k) => {
      this.viajeForm.get(k)?.valueChanges.subscribe(() => {
        // Necesitamos un pequeño timeout porque ruta calcula los tiempos y parchValue tarda un tick
        setTimeout(() => this.checkAvailability());
      });
    });

    // Aplicar estado inicial
    this.updateDistanciaFinalState(this.viajeForm.get('estado')?.value);
    // Ejecutar inicial de disponibilidad si estamos en edit (se removió por solicitud de usuario)
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

  checkAvailability() {
    if (this.editMode()) {
      this.vehiculoValidacionMsg.set(null);
      this.conductorValidacionMsg.set(null);
      return;
    }

    clearTimeout(this.checkAvailabilityTimeout);
    this.checkAvailabilityTimeout = setTimeout(() => {
      // Si no hemos escogido circuito (fija) y estamos creando, el html ni siquiera permite al usuario ver las fechas de viaje
      if (
        !this.hasRutaSelected() &&
        this.viajeForm.get('tipoRuta')?.value === 'fija' &&
        !this.editMode()
      ) {
        this.vehiculoValidacionMsg.set(null);
        this.conductorValidacionMsg.set(null);
        return;
      }

      const fv = this.viajeForm.value;
      const isEdit = this.editMode();
      const viajeId = this.viaje()?.id;

      // Obtener la fecha absoluta mínima (salida) y máxima (llegada)
      let fechaSalidaStr = `${fv.fechaSalidaDate}T${fv.fechaSalidaTime}`;
      let fechaLlegadaStr = `${fv.fechaLlegadaDate}T${fv.fechaLlegadaTime}`;

      if (this.tipoViaje() === 'ambos') {
        fechaLlegadaStr = `${fv.fechaLlegadaVueltaDate}T${fv.fechaLlegadaVueltaTime}`;
      }

      if (
        !fv.fechaSalidaDate ||
        !fv.fechaSalidaTime ||
        !fv.fechaLlegadaDate ||
        !fv.fechaLlegadaTime
      ) {
        this.vehiculoValidacionMsg.set(null);
        this.conductorValidacionMsg.set(null);
        return;
      }

      if (new Date(fechaSalidaStr) >= new Date(fechaLlegadaStr)) {
        this.vehiculoValidacionMsg.set(null);
        this.conductorValidacionMsg.set(null);
        return;
      }

      // Vehicle
      if (fv.vehiculo) {
        const vId = typeof fv.vehiculo === 'object' ? fv.vehiculo.id : fv.vehiculo;
        if (vId) {
          this.viajeService
            .validarVehiculo({
              vehiculoId: vId,
              fechaSalida: fechaSalidaStr,
              fechaLlegada: fechaLlegadaStr,
              viajeId,
            })
            .then((res) => this.vehiculoValidacionMsg.set(res))
            .catch(() => this.vehiculoValidacionMsg.set(null));
        }
      } else {
        this.vehiculoValidacionMsg.set(null);
      }

      // Conductor
      if (fv.conductor) {
        const cId = typeof fv.conductor === 'object' ? fv.conductor.id : fv.conductor;
        if (cId) {
          this.viajeService
            .validarConductor({
              conductorId: cId,
              fechaSalida: fechaSalidaStr,
              fechaLlegada: fechaLlegadaStr,
              viajeId,
            })
            .then((res) => this.conductorValidacionMsg.set(res))
            .catch(() => this.conductorValidacionMsg.set(null));
        }
      } else {
        this.conductorValidacionMsg.set(null);
      }
    }, 400); // 400ms debounce
  }

  formatDateTimeForInput(date: Date | string): string {
    // Si es string y parece formato ISO, cortar para preservar la hora "tal cual" del JSON/Backend
    if (typeof date === 'string' && date.indexOf('T') > -1) {
      return date.substring(0, 16);
    }

    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
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

  calculateEstimatedTimes() {
    if (this.editMode()) return;

    const circuito = this.viajeForm.get('ruta')?.value;
    if (!circuito || typeof circuito !== 'object') return;

    const c = circuito as CircuitoSelection;
    const tipo = this.tipoViaje();

    let timeEstIda = 0;
    let timeEstVuelta = 0;

    if (tipo === 'ida' && c.rutaIda) {
      timeEstIda = c.rutaIda.tiempoEstimado || 0;
    } else if (tipo === 'vuelta' && c.rutaVuelta) {
      timeEstIda = c.rutaVuelta.tiempoEstimado || 0;
    } else if (tipo === 'ambos' && c.rutaIda) {
      timeEstIda = c.rutaIda.tiempoEstimado || 0;
      if (c.rutaVuelta) timeEstVuelta = c.rutaVuelta.tiempoEstimado || 0;
    }

    const formDate = this.viajeForm.get('fechaSalidaDate')?.value;
    const formTime = this.viajeForm.get('fechaSalidaTime')?.value;

    if (formDate && formTime && timeEstIda > 0) {
      const llegadaIda = this.addMinutesToTimeLocal(formDate, formTime, timeEstIda);

      const patchData: any = {
        fechaLlegadaDate: llegadaIda.date,
        fechaLlegadaTime: llegadaIda.time,
      };

      if (tipo === 'ambos' && timeEstVuelta > 0) {
        const salidaVuelta = this.addMinutesToTimeLocal(llegadaIda.date, llegadaIda.time, 20);
        const llegadaVuelta = this.addMinutesToTimeLocal(
          salidaVuelta.date,
          salidaVuelta.time,
          timeEstVuelta,
        );
        patchData.fechaSalidaVueltaDate = salidaVuelta.date;
        patchData.fechaSalidaVueltaTime = salidaVuelta.time;
        patchData.fechaLlegadaVueltaDate = llegadaVuelta.date;
        patchData.fechaLlegadaVueltaTime = llegadaVuelta.time;
      }

      this.viajeForm.patchValue(patchData, { emitEvent: false });
    }
  }

  private addMinutesToTimeLocal(
    dateStr: string,
    timeStr: string,
    minutesToAdd: number,
  ): { date: string; time: string } {
    if (!dateStr || !timeStr) return { date: dateStr, time: timeStr };
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(year, month - 1, day, hours, minutes);
    d.setMinutes(d.getMinutes() + Number(minutesToAdd));

    const outYear = d.getFullYear();
    const outMonth = String(d.getMonth() + 1).padStart(2, '0');
    const outDay = String(d.getDate()).padStart(2, '0');
    const outHours = String(d.getHours()).padStart(2, '0');
    const outMins = String(d.getMinutes()).padStart(2, '0');

    return { date: `${outYear}-${outMonth}-${outDay}`, time: `${outHours}:${outMins}` };
  }

  // Helpers para extraer Date y Time de ISO string en UTC
  private extractDate(dateTime: string): string {
    if (!dateTime) return '';
    const d = new Date(dateTime);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private extractTime(dateTime: string): string {
    if (!dateTime) return '';
    const d = new Date(dateTime);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
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
      entidad,
      ruta,
      ...cleanFormValue
    } = formValue;

    const clienteIdNum = formValue.cliente?.id
      ? Number(formValue.cliente.id)
      : Number(formValue.cliente);
    const tipoRutaVal: 'fija' | 'ocasional' = formValue.tipoRuta || 'fija';

    const buildDetalle = (
      sentido: 'ida' | 'vuelta',
      rutaId?: number,
      fechaSalidaDateVal?: string,
      fechaSalidaTimeVal?: string,
      fechaLlegadaDateVal?: string,
      fechaLlegadaTimeVal?: string,
      distanciaEstimadaVal?: string,
      modalidadServicioVal?: string,
      turnoVal?: string,
      estadoVal?: string,
    ): NonNullable<ApiBody<'viajes', 'create'>['ida']> => {
      const detalle: NonNullable<ApiBody<'viajes', 'create'>['ida']> = {
        clienteId: clienteIdNum,
        entidadId: formValue.entidad ? Number(formValue.entidad) : undefined,
        tipoRuta: tipoRutaVal,
        modalidadServicio: (modalidadServicioVal ||
          formValue.modalidadServicio ||
          'regular') as any, // Only casting enum strings if TS gets weird, but we can avoid it if we know values
        estado: (estadoVal || formValue.estado || 'programado') as any,
        turno: (turnoVal || formValue.turno || 'dia') as any,
        sentido: sentido,
        fechaSalidaProgramada:
          fechaSalidaDateVal && fechaSalidaTimeVal
            ? `${fechaSalidaDateVal}T${fechaSalidaTimeVal}:00.000Z`
            : '',
      };

      // Type-safe assertions since string literal types come from exact matching
      detalle.modalidadServicio = (modalidadServicioVal ||
        formValue.modalidadServicio ||
        'regular') as NonNullable<ApiBody<'viajes', 'create'>['ida']>['modalidadServicio'];
      detalle.estado = (estadoVal || formValue.estado || 'programado') as NonNullable<
        ApiBody<'viajes', 'create'>['ida']
      >['estado'];
      detalle.turno = (turnoVal || formValue.turno || 'dia') as NonNullable<
        ApiBody<'viajes', 'create'>['ida']
      >['turno'];

      if (fechaLlegadaDateVal && fechaLlegadaTimeVal) {
        detalle.fechaLlegadaProgramada = `${fechaLlegadaDateVal}T${fechaLlegadaTimeVal}:00.000Z`;
      }
      if (rutaId) detalle.rutaId = rutaId;
      if (formValue.rutaOcasional) detalle.rutaOcasional = formValue.rutaOcasional;
      if (distanciaEstimadaVal || formValue.distanciaEstimada) {
        detalle.distanciaEstimada = (
          distanciaEstimadaVal || formValue.distanciaEstimada
        ).toString();
      }
      if (formValue.distanciaFinal) detalle.distanciaFinal = formValue.distanciaFinal.toString();
      if (formValue.horasContrato) detalle.horasContrato = formValue.horasContrato.toString();
      if (formValue.vehiculo) {
        detalle.vehiculoId = formValue.vehiculo.id
          ? Number(formValue.vehiculo.id)
          : Number(formValue.vehiculo);
      }
      if (formValue.conductor) {
        detalle.conductorId = formValue.conductor.id
          ? Number(formValue.conductor.id)
          : Number(formValue.conductor);
      }

      return detalle;
    };

    if (
      !this.editMode() &&
      tipoRutaVal === 'fija' &&
      formValue.ruta &&
      typeof formValue.ruta === 'object'
    ) {
      const circuito = formValue.ruta as {
        rutaIda?: { id: number; distancia: string };
        rutaVuelta?: { id: number; distancia: string };
      };
      const tipo = this.tipoViaje();

      if (tipo === 'ambos') {
        const createPayload: ApiBody<'viajes', 'create'> = {};
        // Ida
        if (circuito.rutaIda) {
          createPayload.ida = buildDetalle(
            'ida',
            circuito.rutaIda.id,
            formValue.fechaSalidaDate,
            formValue.fechaSalidaTime,
            formValue.fechaLlegadaDate,
            formValue.fechaLlegadaTime,
            circuito.rutaIda.distancia,
          );
        }
        // Vuelta
        if (circuito.rutaVuelta) {
          createPayload.vuelta = buildDetalle(
            'vuelta',
            circuito.rutaVuelta.id,
            formValue.fechaSalidaVueltaDate,
            formValue.fechaSalidaVueltaTime,
            formValue.fechaLlegadaVueltaDate,
            formValue.fechaLlegadaVueltaTime,
            formValue.distanciaEstimadaVuelta || circuito.rutaVuelta.distancia,
            formValue.modalidadServicioVuelta,
            formValue.turnoVuelta,
            formValue.estadoVuelta,
          );
        }
        if (this.editMode()) {
          console.error('No se puede editar a tipo "ambos" (múltiples viajes)');
          return;
        }
        this.onSubmitForm.emit(createPayload);
      } else {
        // Solo ida o solo vuelta
        let rutaId: number | undefined;
        let sentido: 'ida' | 'vuelta' = 'ida';
        let distancia: string | undefined;

        if (tipo === 'ida' && circuito.rutaIda) {
          rutaId = circuito.rutaIda.id;
          sentido = 'ida';
          distancia = circuito.rutaIda.distancia;
        } else if (tipo === 'vuelta' && circuito.rutaVuelta) {
          rutaId = circuito.rutaVuelta.id;
          sentido = 'vuelta';
          distancia = circuito.rutaVuelta.distancia;
        }

        if (rutaId) {
          const payload = buildDetalle(
            sentido,
            rutaId,
            formValue.fechaSalidaDate,
            formValue.fechaSalidaTime,
            formValue.fechaLlegadaDate,
            formValue.fechaLlegadaTime,
            distancia,
          );

          if (this.editMode()) {
            this.onUpdate.emit(payload);
          } else {
            const createPayload: ApiBody<'viajes', 'create'> = {};
            if (sentido === 'ida') createPayload.ida = payload;
            else createPayload.vuelta = payload;
            this.onSubmitForm.emit(createPayload);
          }
        } else {
          console.error('El circuito seleccionado no tiene la ruta para el sentido escogido');
        }
      }
    } else {
      // Caso Ocasional o Edición (donde ruta podría ser ID)
      const rutaIdObj = formValue.ruta?.id
        ? Number(formValue.ruta.id)
        : Number(formValue.ruta) || undefined;

      const payload = buildDetalle(
        formValue.sentido || 'ida',
        rutaIdObj,
        formValue.fechaSalidaDate,
        formValue.fechaSalidaTime,
        formValue.fechaLlegadaDate,
        formValue.fechaLlegadaTime,
      );

      if (this.editMode()) {
        this.onUpdate.emit(payload);
      } else {
        const createPayload: ApiBody<'viajes', 'create'> = {
          ida: payload,
        };
        this.onSubmitForm.emit(createPayload);
      }
    }
  }
}
