import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  ViajeResultDto,
  ViajeEstado,
  ViajeModalidadServicio,
} from '@interface/admin/viaje.interface';
import { RutaResultDto } from '@interface/admin/ruta.interface';
import { ClienteInputSearch } from '@module/admin/content/clientes/layout/cliente-input-search/cliente-input-search';
import { RutaInputSearch } from '@module/admin/content/rutas/layout/ruta-input-search/ruta-input-search';
import { VehiculoInputSearch } from '@module/admin/content/vehiculos/layout/vehiculo-input-search/vehiculo-input-search';
import { ConductorInputSearch } from '@module/admin/content/conductores/layout/conductor-input-search/conductor-input-search';
import { ViajeConductoresForm } from './content/viaje-conductores-form/viaje-conductores-form';
import { ViajeVehiculosForm } from './content/viaje-vehiculos-form/viaje-vehiculos-form';
import { ViajeComentariosForm } from './content/viaje-comentarios-form/viaje-comentarios-form';

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
    ViajeComentariosForm,
  ],
  templateUrl: './viaje-form.html',
  styleUrl: './viaje-form.css',
})
export class ViajeForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  viaje = input<ViajeResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<any>();
  onDataChange = output<void>();

  // Catálogos
  loadingCatalogos = signal(false);

  viajeForm: FormGroup = this.fb.group({
    cliente: [null, [Validators.required]],
    tipoRuta: ['fija', [Validators.required]],
    ruta: [null, [Validators.required]],
    rutaOcasional: [''],
    distanciaEstimada: ['', [Validators.required]],
    distanciaFinal: [{ value: '', disabled: true }],
    modalidadServicio: ['regular', [Validators.required]],
    vehiculo: [null, [Validators.required]],
    conductor: [null, [Validators.required]],
    tripulantes: this.fb.array([]),
    fechaSalida: ['', [Validators.required]],
    fechaLlegada: ['', [Validators.required]],
    estado: ['programado', [Validators.required]],
  });

  estados: Array<{ value: ViajeEstado; label: string; icon: string; color: string }> = [
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
    value: ViajeModalidadServicio;
    label: string;
    icon: string;
    color: string;
  }> = [
    { value: 'regular', label: 'Regular', icon: 'fa-bus', color: 'text-text/70' },
    { value: 'expreso', label: 'Expreso', icon: 'fa-shipping-fast', color: 'text-warning' },
    { value: 'ejecutivo', label: 'Ejecutivo', icon: 'fa-briefcase', color: 'text-primary' },
    { value: 'especial', label: 'Especial', icon: 'fa-star', color: 'text-secondary' },
    { value: 'turismo', label: 'Turismo', icon: 'fa-camera', color: 'text-success' },
  ];

  get tripulantesArray() {
    return this.viajeForm.get('tripulantes') as FormArray;
  }

  addTripulante(nombre: string = '') {
    this.tripulantesArray.push(this.fb.control(nombre, Validators.required));
  }

  removeTripulante(index: number) {
    this.tripulantesArray.removeAt(index);
  }

  ngOnInit() {
    this.loadCatalogos();

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
    this.viajeForm.get('ruta')?.valueChanges.subscribe((ruta: RutaResultDto | null) => {
      if (ruta && this.viajeForm.get('tipoRuta')?.value === 'fija') {
        this.viajeForm.patchValue({
          distanciaEstimada: ruta.distancia || '',
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

  updateDistanciaFinalState(estado: string) {
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

  loadCatalogos() {
    // Si estamos editando, setear formulario
    const viajeData = this.viaje();
    if (this.editMode() && viajeData) {
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
        fechaSalida: this.formatDateTimeLocal(viajeData.fechaSalida),
        fechaLlegada: viajeData.fechaLlegada
          ? this.formatDateTimeLocal(viajeData.fechaLlegada)
          : '',
        estado: viajeData.estado,
      });

      // Cargar tripulantes
      this.tripulantesArray.clear();
      if (viajeData.tripulantes && viajeData.tripulantes.length > 0) {
        viajeData.tripulantes.forEach((t) => this.addTripulante(t));
      }

      // Aplicar estado de distanciaFinal después de cargar datos
      this.updateDistanciaFinalState(viajeData.estado);
    } else {
      this.viajeForm.reset({
        estado: 'programado',
        tipoRuta: 'fija',
        modalidadServicio: 'regular',
      });
      this.tripulantesArray.clear();
      // Desactivar distanciaFinal por defecto (estado = programado)
      this.updateDistanciaFinalState('programado');
    }
  }

  formatDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  submitForm() {
    if (this.viajeForm.invalid) {
      this.viajeForm.markAllAsTouched();
      return;
    }

    const formValue = this.viajeForm.value;
    const formData = {
      ...formValue,
      rutaId: formValue.ruta?.id ? Number(formValue.ruta.id) : undefined,
      vehiculoId: formValue.vehiculo?.id ? Number(formValue.vehiculo.id) : undefined,
      conductorId: formValue.conductor?.id ? Number(formValue.conductor.id) : undefined,
      clienteId: formValue.cliente?.id ? Number(formValue.cliente.id) : undefined,
      fechaSalida: new Date(formValue.fechaSalida).toISOString(),
      fechaLlegada: formValue.fechaLlegada ? new Date(formValue.fechaLlegada).toISOString() : null,
      tripulantes: formValue.tripulantes, // Already an array of strings
      // Eliminar campos con nombres de objeto
      ruta: undefined,
      vehiculo: undefined,
      conductor: undefined,
      cliente: undefined,
    };

    this.onSubmitForm.emit(formData);
  }
}
