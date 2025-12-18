import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  ViajeResultDto,
  ViajeEstado,
  ViajeModalidadServicio,
} from '@interface/admin/viaje.interface';
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
    clienteId: ['', [Validators.required]],
    tipoRuta: ['fija', [Validators.required]],
    rutaId: [''],
    rutaOcasional: [''],
    modalidadServicio: ['regular', [Validators.required]],
    vehiculoId: ['', [Validators.required]],
    conductorId: ['', [Validators.required]],
    tripulantes: this.fb.array([]),
    fechaSalida: ['', [Validators.required]],
    fechaLlegada: [''],
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
      const rutaIdControl = this.viajeForm.get('rutaId');
      const rutaOcasionalControl = this.viajeForm.get('rutaOcasional');

      if (tipo === 'fija') {
        rutaIdControl?.setValidators([Validators.required]);
        rutaOcasionalControl?.clearValidators();
        rutaOcasionalControl?.setValue('');
      } else {
        rutaOcasionalControl?.setValidators([Validators.required]);
        rutaIdControl?.clearValidators();
        rutaIdControl?.setValue('');
      }
      rutaIdControl?.updateValueAndValidity();
      rutaOcasionalControl?.updateValueAndValidity();
    });
  }

  loadCatalogos() {
    // Si estamos editando, setear formulario
    const viajeData = this.viaje();
    if (this.editMode() && viajeData) {
      this.viajeForm.patchValue({
        clienteId: viajeData.clienteId,
        tipoRuta: viajeData.tipoRuta,
        rutaId: viajeData.rutaId,
        rutaOcasional: viajeData.rutaOcasional,
        modalidadServicio: viajeData.modalidadServicio,
        vehiculoId: viajeData.vehiculoPrincipal?.id,
        conductorId: viajeData.conductorPrincipal?.id,
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
    } else {
      this.viajeForm.reset({
        estado: 'programado',
        tipoRuta: 'fija',
        modalidadServicio: 'regular',
      });
      this.tripulantesArray.clear();
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
      rutaId: formValue.rutaId ? Number(formValue.rutaId) : undefined,
      vehiculoId: Number(formValue.vehiculoId),
      conductorId: Number(formValue.conductorId),
      clienteId: Number(formValue.clienteId),
      fechaSalida: new Date(formValue.fechaSalida).toISOString(),
      fechaLlegada: formValue.fechaLlegada ? new Date(formValue.fechaLlegada).toISOString() : null,
      tripulantes: formValue.tripulantes, // Already an array of strings
    };

    this.onSubmitForm.emit(formData);
  }
}
