import { Injectable, signal, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ViajeService } from '@service/admin/viaje.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

type ViajeDetalleType = NonNullable<ApiBody<'viajes', 'create'>['ida']>;

interface CircuitoSelection {
  id?: number | string;
  rutaIda?: { id: number; distancia: string; tiempoEstimado: number };
  rutaVuelta?: { id: number; distancia: string; tiempoEstimado: number };
}

interface ViajeFormValue {
  cliente?: { id?: number | string; horasContrato?: string | number } | number | string;
  entidad?: { id?: number | string } | number | string;
  tipoRuta?: 'fija' | 'ocasional';
  ruta?: CircuitoSelection | number | string;
  rutaOcasional?: string;
  distanciaEstimada?: string | number;
  distanciaEstimadaVuelta?: string | number;
  distanciaFinal?: string | number;
  horasContrato?: string | number;
  modalidadServicio?: ViajeDetalleType['modalidadServicio'];
  modalidadServicioVuelta?: ViajeDetalleType['modalidadServicio'];
  vehiculo?: { id?: number | string } | number | string;
  conductor?: { id?: number | string } | number | string;
  fechaSalidaDate?: string;
  fechaSalidaTime?: string;
  fechaLlegadaDate?: string;
  fechaLlegadaTime?: string;
  fechaSalidaVueltaDate?: string;
  fechaSalidaVueltaTime?: string;
  fechaLlegadaVueltaDate?: string;
  fechaLlegadaVueltaTime?: string;
  estado?: ViajeDetalleType['estado'];
  estadoVuelta?: ViajeDetalleType['estado'];
  turno?: ViajeDetalleType['turno'];
  turnoVuelta?: ViajeDetalleType['turno'];
  sentido?: ViajeDetalleType['sentido'];
  metadata?: Record<string, unknown>;
}

@Injectable()
export class ViajeFormService {
  private fb = inject(FormBuilder);
  private viajeService = inject(ViajeService);

  // State Signals
  tipoViaje = signal<'ida' | 'vuelta' | 'ambos' | 'circuito'>('ida');
  hasRutaIda = signal<boolean>(false);
  hasRutaVuelta = signal<boolean>(false);
  hasRutaSelected = signal<boolean>(false);
  selectedClienteId = signal<number | null>(null);

  // Validation Signals
  vehiculoValidacionMsg = signal<{ status: boolean; message: string } | null>(null);
  conductorValidacionMsg = signal<{ status: boolean; message: string } | null>(null);

  // Form State
  viajeForm: FormGroup;
  editMode = signal<boolean>(false);
  viajeId = signal<number | undefined>(undefined);

  private checkAvailabilitySubject = new Subject<void>();

  constructor() {
    this.viajeForm = this.fb.group({
      cliente: [null, [Validators.required]],
      entidad: [null],
      tipoRuta: ['ocasional', [Validators.required]],
      ruta: [null, [Validators.required]],
      rutaOcasional: [''],
      distanciaEstimada: [''],
      distanciaEstimadaVuelta: [''],
      distanciaFinal: [{ value: '', disabled: true }],
      horasContrato: [''],
      modalidadServicio: ['regular', [Validators.required]],
      modalidadServicioVuelta: ['regular'],
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
      estado: ['programado', [Validators.required]],
      estadoVuelta: ['programado'],
      turno: ['dia', [Validators.required]],
      turnoVuelta: ['dia'],
      sentido: ['ida', [Validators.required]],
      metadata: [null],
    });

    this.setupListeners();
    this.setupAvailabilityChecker();
  }

  getTodayDate(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helpers
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

  patchViajeData(viajeData: ApiResponse<'viajes', 'findOne'>, isEdit: boolean) {
    this.editMode.set(isEdit);
    this.viajeId.set(viajeData.id);

    this.viajeForm.patchValue({
      cliente: viajeData.clienteId,
      entidad: viajeData.entidadId || null,
      tipoRuta: viajeData.tipoRuta,
      ruta: viajeData.rutaId,
      rutaOcasional: viajeData.rutaOcasional,
      distanciaEstimada: viajeData.distanciaEstimada || '',
      distanciaFinal: viajeData.distanciaFinal || '',
      modalidadServicio: viajeData.modalidadServicio,
      vehiculo: viajeData.vehiculos?.[0]?.id,
      conductor: viajeData.conductores?.[0]?.id,
      horasContrato: viajeData.horasContrato,
      fechaSalidaDate: viajeData.fechaSalidaProgramada ? this.extractDate(viajeData.fechaSalidaProgramada) : '',
      fechaSalidaTime: viajeData.fechaSalidaProgramada ? this.extractTime(viajeData.fechaSalidaProgramada) : '',
      fechaLlegadaDate: viajeData.fechaLlegadaProgramada ? this.extractDate(viajeData.fechaLlegadaProgramada) : '',
      fechaLlegadaTime: viajeData.fechaLlegadaProgramada ? this.extractTime(viajeData.fechaLlegadaProgramada) : '',
      estado: viajeData.estado,
      turno: viajeData.turno,
      sentido: viajeData.sentido,
      metadata: viajeData.metadata,
      fechaSalidaVueltaDate: '',
      fechaSalidaVueltaTime: '',
      fechaLlegadaVueltaDate: '',
      fechaLlegadaVueltaTime: '',
      distanciaEstimadaVuelta: '',
    });

    if (viajeData.sentido === 'vuelta') this.tipoViaje.set('vuelta');
    else if (viajeData.sentido === 'circuito') this.tipoViaje.set('circuito');
    else this.tipoViaje.set('ida');

    this.viajeForm.get('vehiculo')?.clearValidators();
    this.viajeForm.get('conductor')?.clearValidators();
    this.viajeForm.get('vehiculo')?.updateValueAndValidity();
    this.viajeForm.get('conductor')?.updateValueAndValidity();

    this.updateDistanciaFinalState(viajeData.estado);
  }

  resetForm() {
    this.editMode.set(false);
    this.viajeId.set(undefined);

    this.viajeForm.get('vehiculo')?.setValidators([Validators.required]);
    this.viajeForm.get('conductor')?.setValidators([Validators.required]);
    this.viajeForm.get('vehiculo')?.updateValueAndValidity();
    this.viajeForm.get('conductor')?.updateValueAndValidity();

    this.viajeForm.reset({
      modalidadServicio: 'regular',
      turno: 'dia',
      sentido: 'ida',
      metadata: null,
      tipoViaje: 'ida',
      estado: 'programado',
      estadoVuelta: 'programado',
      tipoRuta: 'ocasional',
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
    this.updateDistanciaFinalState('programado');
  }

  private setupListeners() {
    this.viajeForm.get('tipoRuta')?.valueChanges.subscribe((tipo) => {
      const rutaControl = this.viajeForm.get('ruta');
      const rutaOcasionalControl = this.viajeForm.get('rutaOcasional');
      const distControl = this.viajeForm.get('distanciaEstimada');

      if (tipo === 'fija') {
        rutaControl?.setValidators([Validators.required]);
        rutaOcasionalControl?.clearValidators();
        rutaOcasionalControl?.setValue('');
        distControl?.clearValidators();
      } else {
        rutaOcasionalControl?.setValidators([Validators.required]);
        rutaControl?.clearValidators();
        rutaControl?.setValue(null);
        distControl?.clearValidators();
        distControl?.setValue('');

        this.viajeForm.get('sentido')?.setValue('circuito');
        this.tipoViaje.set('circuito');
      }
      rutaControl?.updateValueAndValidity();
      rutaOcasionalControl?.updateValueAndValidity();
      distControl?.updateValueAndValidity();
    });

    this.viajeForm.get('ruta')?.valueChanges.subscribe((circuito) => {
      this.handleRutaChange(circuito);
    });

    this.viajeForm.get('cliente')?.valueChanges.subscribe((cliente) => {
      this.viajeForm.patchValue({ entidad: null }, { emitEvent: false });
      if (cliente && typeof cliente === 'object') {
        this.selectedClienteId.set(cliente.id || null);
        if (cliente.horasContrato !== undefined) {
          this.viajeForm.patchValue({ horasContrato: cliente.horasContrato });
        }
      } else if (cliente && typeof cliente === 'number') {
        this.selectedClienteId.set(cliente);
        this.viajeForm.patchValue({ horasContrato: '' }, { emitEvent: false });
      } else {
        this.selectedClienteId.set(null);
        this.viajeForm.patchValue({ horasContrato: '' });
      }
    });

    this.viajeForm.get('estado')?.valueChanges.subscribe(estado => this.updateDistanciaFinalState(estado));

    const validateKeys = ['fechaSalidaDate', 'fechaSalidaTime', 'fechaLlegadaDate', 'fechaLlegadaTime', 'fechaSalidaVueltaDate', 'fechaSalidaVueltaTime', 'fechaLlegadaVueltaDate', 'fechaLlegadaVueltaTime', 'vehiculo', 'conductor', 'ruta'];
    validateKeys.forEach((k) => {
      this.viajeForm.get(k)?.valueChanges.subscribe(() => {
        this.checkAvailabilitySubject.next();
      });
    });
  }

  private handleRutaChange(circuito: CircuitoSelection | string | number | null) {
    if (circuito && typeof circuito === 'object' && this.viajeForm.get('tipoRuta')?.value === 'fija') {
      const c: CircuitoSelection = circuito;
      const tipo = this.tipoViaje();

      this.hasRutaIda.set(!!c.rutaIda);
      this.hasRutaVuelta.set(!!c.rutaVuelta);
      this.hasRutaSelected.set(true);

      if (c.rutaIda && c.rutaVuelta) this.tipoViaje.set('ambos');
      else if (c.rutaIda && !c.rutaVuelta) this.tipoViaje.set('ida');
      else if (!c.rutaIda && c.rutaVuelta) this.tipoViaje.set('vuelta');

      let dist = '';
      if (tipo === 'ida' && c.rutaIda) dist = c.rutaIda.distancia;
      else if (tipo === 'vuelta' && c.rutaVuelta) dist = c.rutaVuelta.distancia;
      else if (tipo === 'ambos' && c.rutaIda) dist = c.rutaIda.distancia;

      if (dist) this.viajeForm.patchValue({ distanciaEstimada: dist });

      if (tipo === 'ambos' && c.rutaVuelta) {
        this.viajeForm.patchValue({ distanciaEstimadaVuelta: c.rutaVuelta.distancia });
      }
      this.calculateEstimatedTimes();
    } else {
      this.hasRutaIda.set(false);
      this.hasRutaVuelta.set(false);
      this.hasRutaSelected.set(false);
    }
  }

  updateDistanciaFinalState(estado: string | null | undefined) {
    const control = this.viajeForm.get('distanciaFinal');
    if (estado === 'completado') {
      control?.enable();
      control?.setValidators([Validators.required]);
    } else {
      control?.disable();
      control?.setValue('');
      control?.clearValidators();
    }
    control?.updateValueAndValidity();
  }

  calculateEstimatedTimes() {
    if (this.editMode()) return;

    const circuito: CircuitoSelection | string | number | null = this.viajeForm.get('ruta')?.value;
    if (!circuito || typeof circuito !== 'object') return;

    const c: CircuitoSelection = circuito;
    const tipo = this.tipoViaje();

    let timeEstIda = 0;
    let timeEstVuelta = 0;

    if (tipo === 'ida' && c.rutaIda) timeEstIda = c.rutaIda.tiempoEstimado || 0;
    else if (tipo === 'vuelta' && c.rutaVuelta) timeEstIda = c.rutaVuelta.tiempoEstimado || 0;
    else if (tipo === 'ambos' && c.rutaIda) {
      timeEstIda = c.rutaIda.tiempoEstimado || 0;
      if (c.rutaVuelta) timeEstVuelta = c.rutaVuelta.tiempoEstimado || 0;
    }

    const formDate = this.viajeForm.get('fechaSalidaDate')?.value;
    const formTime = this.viajeForm.get('fechaSalidaTime')?.value;

    if (formDate && formTime && timeEstIda > 0) {
      const llegadaIda = this.addMinutesToTimeLocal(formDate, formTime, timeEstIda);
      const patchData: Partial<ViajeFormValue> = { fechaLlegadaDate: llegadaIda.date, fechaLlegadaTime: llegadaIda.time };

      if (tipo === 'ambos' && timeEstVuelta > 0) {
        const salidaVuelta = this.addMinutesToTimeLocal(llegadaIda.date, llegadaIda.time, 20);
        const llegadaVuelta = this.addMinutesToTimeLocal(salidaVuelta.date, salidaVuelta.time, timeEstVuelta);
        patchData.fechaSalidaVueltaDate = salidaVuelta.date;
        patchData.fechaSalidaVueltaTime = salidaVuelta.time;
        patchData.fechaLlegadaVueltaDate = llegadaVuelta.date;
        patchData.fechaLlegadaVueltaTime = llegadaVuelta.time;
      }

      this.viajeForm.patchValue(patchData, { emitEvent: false });
    }
  }

  private addMinutesToTimeLocal(dateStr: string, timeStr: string, minutesToAdd: number) {
    if (!dateStr || !timeStr) return { date: dateStr, time: timeStr };
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(year, month - 1, day, hours, minutes);
    d.setMinutes(d.getMinutes() + Number(minutesToAdd));

    return {
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    };
  }

  private setupAvailabilityChecker() {
    this.checkAvailabilitySubject.pipe(debounceTime(400)).subscribe(() => {
      this.executeAvailabilityCheck();
    });
  }

  private executeAvailabilityCheck() {
    if (this.editMode()) {
      this.vehiculoValidacionMsg.set(null);
      this.conductorValidacionMsg.set(null);
      return;
    }

    if (!this.hasRutaSelected() && this.viajeForm.get('tipoRuta')?.value === 'fija') {
      this.vehiculoValidacionMsg.set(null);
      this.conductorValidacionMsg.set(null);
      return;
    }

    const fv = this.viajeForm.value;
    let fechaSalidaStr = `${fv.fechaSalidaDate}T${fv.fechaSalidaTime}`;
    let fechaLlegadaStr = `${fv.fechaLlegadaDate}T${fv.fechaLlegadaTime}`;

    if (this.tipoViaje() === 'ambos') {
      fechaLlegadaStr = `${fv.fechaLlegadaVueltaDate}T${fv.fechaLlegadaVueltaTime}`;
    }

    if (!fv.fechaSalidaDate || !fv.fechaSalidaTime || !fv.fechaLlegadaDate || !fv.fechaLlegadaTime || new Date(fechaSalidaStr) >= new Date(fechaLlegadaStr)) {
      this.vehiculoValidacionMsg.set(null);
      this.conductorValidacionMsg.set(null);
      return;
    }

    if (fv.vehiculo) {
      const vId = typeof fv.vehiculo === 'object' ? fv.vehiculo.id : fv.vehiculo;
      if (vId) {
        this.viajeService.validarVehiculo({ vehiculoId: vId, fechaSalida: fechaSalidaStr, fechaLlegada: fechaLlegadaStr, viajeId: this.viajeId() })
          .then(res => this.vehiculoValidacionMsg.set(res))
          .catch(() => this.vehiculoValidacionMsg.set(null));
      }
    } else this.vehiculoValidacionMsg.set(null);

    if (fv.conductor) {
      const cId = typeof fv.conductor === 'object' ? fv.conductor.id : fv.conductor;
      if (cId) {
        this.viajeService.validarConductor({ conductorId: cId, fechaSalida: fechaSalidaStr, fechaLlegada: fechaLlegadaStr, viajeId: this.viajeId() })
          .then(res => this.conductorValidacionMsg.set(res))
          .catch(() => this.conductorValidacionMsg.set(null));
      }
    } else this.conductorValidacionMsg.set(null);
  }
  // === mapper ===
  toCreateDto(
    formValue: ViajeFormValue,
    tipoViaje: 'ida' | 'vuelta' | 'ambos' | 'circuito'
  ): ApiBody<'viajes', 'create'> {
    const { tipoRuta, circuito } = this.extractBaseInfo(formValue);

    if (tipoRuta === 'fija' && formValue.ruta && typeof formValue.ruta === 'object') {
      const c: CircuitoSelection = formValue.ruta;

      if (tipoViaje === 'ambos') {
        const createPayload: ApiBody<'viajes', 'create'> = {};
        if (c.rutaIda) {
          createPayload.ida = this.buildDetalle(
            formValue,
            'ida',
            c.rutaIda.id,
            formValue.fechaSalidaDate,
            formValue.fechaSalidaTime,
            formValue.fechaLlegadaDate,
            formValue.fechaLlegadaTime,
            c.rutaIda.distancia
          );
        }
        if (c.rutaVuelta) {
          createPayload.vuelta = this.buildDetalle(
            formValue,
            'vuelta',
            c.rutaVuelta.id,
            formValue.fechaSalidaVueltaDate,
            formValue.fechaSalidaVueltaTime,
            formValue.fechaLlegadaVueltaDate,
            formValue.fechaLlegadaVueltaTime,
            formValue.distanciaEstimadaVuelta || c.rutaVuelta.distancia,
            formValue.modalidadServicioVuelta,
            formValue.turnoVuelta,
            formValue.estadoVuelta
          );
        }
        return createPayload;
      } else {
        let rutaId: number | undefined;
        let sentido: 'ida' | 'vuelta' | 'circuito' = formValue.sentido || 'ida';
        let distancia: string | undefined;

        if (tipoViaje === 'ida' && c.rutaIda) {
          rutaId = c.rutaIda.id;
          sentido = 'ida';
          distancia = c.rutaIda.distancia;
        } else if (tipoViaje === 'vuelta' && c.rutaVuelta) {
          rutaId = c.rutaVuelta.id;
          sentido = 'vuelta';
          distancia = c.rutaVuelta.distancia;
        }

        if (rutaId) {
          const payload = this.buildDetalle(
            formValue,
            sentido,
            rutaId,
            formValue.fechaSalidaDate,
            formValue.fechaSalidaTime,
            formValue.fechaLlegadaDate,
            formValue.fechaLlegadaTime,
            distancia
          );
          const createPayload: ApiBody<'viajes', 'create'> = {};
          if (sentido === 'ida') createPayload.ida = payload;
          else createPayload.vuelta = payload;
          return createPayload;
        }
      }
    }

    // Ocasional o sin rutas especificas validas
    const rutaIdObj = (formValue.ruta && typeof formValue.ruta === 'object') ? Number(formValue.ruta.id) : Number(formValue.ruta) || undefined;

    const payload = this.buildDetalle(
      formValue,
      formValue.sentido || 'ida',
      rutaIdObj,
      formValue.fechaSalidaDate,
      formValue.fechaSalidaTime,
      formValue.fechaLlegadaDate,
      formValue.fechaLlegadaTime,
      formValue.distanciaEstimada,
      formValue.modalidadServicio,
      formValue.turno,
      formValue.estado,
      formValue.metadata
    );

    return { ida: payload };
  }

  toUpdateDto(formValue: ViajeFormValue): ApiBody<'viajes', 'update'> {
    const rutaIdObj = (formValue.ruta && typeof formValue.ruta === 'object') ? Number(formValue.ruta.id) : Number(formValue.ruta) || undefined;

    return this.buildDetalle(
      formValue,
      formValue.sentido || 'ida',
      rutaIdObj,
      formValue.fechaSalidaDate,
      formValue.fechaSalidaTime,
      formValue.fechaLlegadaDate,
      formValue.fechaLlegadaTime,
      formValue.distanciaEstimada,
      formValue.modalidadServicio,
      formValue.turno,
      formValue.estado,
      formValue.metadata
    );
  }

  private extractBaseInfo(formValue: ViajeFormValue) {
    const clienteObj = formValue.cliente && typeof formValue.cliente === 'object' ? formValue.cliente : undefined;
    const entidadObj = formValue.entidad && typeof formValue.entidad === 'object' ? formValue.entidad : undefined;

    return {
      clienteIdNum: clienteObj ? Number(clienteObj.id) : Number(formValue.cliente),
      entidadIdNum: entidadObj ? Number(entidadObj.id) : formValue.entidad ? Number(formValue.entidad) : undefined,
      tipoRuta: formValue.tipoRuta || 'ocasional',
      circuito: formValue.ruta,
    };
  }

  private buildDetalle(
    formValue: ViajeFormValue,
    sentido: 'ida' | 'vuelta' | 'circuito',
    rutaId?: number,
    fechaSalidaDateVal?: string,
    fechaSalidaTimeVal?: string,
    fechaLlegadaDateVal?: string,
    fechaLlegadaTimeVal?: string,
    distanciaEstimadaVal?: string | number,
    modalidadServicioVal?: ViajeFormValue['modalidadServicio'],
    turnoVal?: ViajeFormValue['turno'],
    estadoVal?: ViajeFormValue['estado'],
    metadataVal?: Record<string, unknown>
  ): NonNullable<ApiBody<'viajes', 'create'>['ida']> {
    const { clienteIdNum, entidadIdNum, tipoRuta } = this.extractBaseInfo(formValue);

    const detalle: NonNullable<ApiBody<'viajes', 'create'>['ida']> = {
      clienteId: clienteIdNum,
      entidadId: entidadIdNum,
      tipoRuta: tipoRuta,
      metadata: metadataVal || formValue.metadata || undefined,
      modalidadServicio: modalidadServicioVal || formValue.modalidadServicio || 'regular',
      estado: estadoVal || formValue.estado || 'programado',
      turno: turnoVal || formValue.turno || 'dia',
      sentido: sentido,
      fechaSalidaProgramada: fechaSalidaDateVal && fechaSalidaTimeVal ? `${fechaSalidaDateVal}T${fechaSalidaTimeVal}:00.000Z` : '',
    };

    if (fechaLlegadaDateVal && fechaLlegadaTimeVal) {
      detalle.fechaLlegadaProgramada = `${fechaLlegadaDateVal}T${fechaLlegadaTimeVal}:00.000Z`;
    }
    if (rutaId) detalle.rutaId = rutaId;
    if (formValue.rutaOcasional) detalle.rutaOcasional = formValue.rutaOcasional;

    const distEst = distanciaEstimadaVal || formValue.distanciaEstimada;
    if (distEst !== undefined && distEst !== null && distEst !== '') {
      detalle.distanciaEstimada = distEst.toString();
    }

    if (formValue.distanciaFinal !== undefined && formValue.distanciaFinal !== null && formValue.distanciaFinal !== '') {
      detalle.distanciaFinal = formValue.distanciaFinal.toString();
    }
    if (formValue.horasContrato !== undefined && formValue.horasContrato !== null && formValue.horasContrato !== '') {
      detalle.horasContrato = formValue.horasContrato.toString();
    }

    if (formValue.vehiculo) {
      if (typeof formValue.vehiculo === 'object' && formValue.vehiculo.id) {
        detalle.vehiculoId = Number(formValue.vehiculo.id);
      } else {
        detalle.vehiculoId = Number(formValue.vehiculo);
      }
    }
    if (formValue.conductor) {
      if (typeof formValue.conductor === 'object' && formValue.conductor.id) {
        detalle.conductorId = Number(formValue.conductor.id);
      } else {
        detalle.conductorId = Number(formValue.conductor);
      }
    }

    return detalle;
  }
}
