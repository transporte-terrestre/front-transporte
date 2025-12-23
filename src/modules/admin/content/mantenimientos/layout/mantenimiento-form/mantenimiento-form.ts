import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MantenimientoResultDto,
  MantenimientoCreateDto,
  MantenimientoUpdateDto,
  TipoMantenimiento,
  MantenimientoEstado,
} from '@interface/admin/mantenimiento.interface';
import { VehiculoInputSearch } from '@module/admin/content/vehiculos/layout/vehiculo-input-search/vehiculo-input-search';
import { TallerInputSearch } from '@module/admin/content/talleres/layout/taller-input-search/taller-input-search';
import { MantenimientoTareasForm } from './content/mantenimiento-tareas-form/mantenimiento-tareas-form';
import { MantenimientoDocumentosForm } from './content/mantenimiento-documentos-form/mantenimiento-documentos-form';

@Component({
  selector: 'app-mantenimiento-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VehiculoInputSearch,
    TallerInputSearch,
    MantenimientoTareasForm,
    MantenimientoDocumentosForm,
  ],
  templateUrl: './mantenimiento-form.html',
  styleUrl: './mantenimiento-form.css',
})
export class MantenimientoForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  mantenimiento = input<MantenimientoResultDto | null>(null);
  editMode = input<boolean>(false);
  selectedDate = input<Date | null>(null);

  // Outputs
  onSubmitForm = output<MantenimientoCreateDto | MantenimientoUpdateDto>();
  onDataChange = output<void>();

  mantenimientoForm: FormGroup = this.fb.group({
    vehiculo: [null, [Validators.required]],
    taller: [null, [Validators.required]],
    codigoOrden: [{ value: '', disabled: true }],
    tipo: ['preventivo', [Validators.required]],
    costoTotal: ['', [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fechaIngreso: ['', [Validators.required]],
    fechaSalida: ['', [Validators.required]],
    kilometraje: ['', [Validators.required, Validators.min(0)]],
    estado: ['pendiente', [Validators.required]],
  });

  tipos: Array<{ value: TipoMantenimiento; label: string; icon: string; color: string }> = [
    { value: 'preventivo', label: 'Preventivo', icon: 'fa-shield-alt', color: 'text-info' },
    { value: 'correctivo', label: 'Correctivo', icon: 'fa-wrench', color: 'text-warning' },
  ];

  estados: Array<{ value: MantenimientoEstado; label: string; icon: string; color: string }> = [
    { value: 'pendiente', label: 'Pendiente', icon: 'fa-clock', color: 'text-info' },
    { value: 'en_proceso', label: 'En Proceso', icon: 'fa-tools', color: 'text-warning' },
    { value: 'finalizado', label: 'Finalizado', icon: 'fa-check-circle', color: 'text-success' },
  ];

  constructor() {
    effect(() => {
      const mantenimientoData = this.mantenimiento();
      const isEditMode = this.editMode();
      const dateSelected = this.selectedDate();

      if (isEditMode && mantenimientoData) {
        this.mantenimientoForm.patchValue({
          vehiculo: mantenimientoData.vehiculoId,
          taller: mantenimientoData.tallerId,
          codigoOrden: mantenimientoData.codigoOrden,
          tipo: mantenimientoData.tipo,
          costoTotal: mantenimientoData.costoTotal,
          descripcion: mantenimientoData.descripcion,
          fechaIngreso: mantenimientoData.fechaIngreso
            ? this.formatDateTimeForInput(mantenimientoData.fechaIngreso)
            : '',
          fechaSalida: mantenimientoData.fechaSalida
            ? this.formatDateTimeForInput(mantenimientoData.fechaSalida)
            : '',
          kilometraje: mantenimientoData.kilometraje,
          estado: mantenimientoData.estado,
        });
      } else {
        // Si hay una fecha seleccionada del calendario, usarla
        const fechaInicial = dateSelected ? this.formatDateTimeForInput(dateSelected) : '';
        this.mantenimientoForm.reset({
          tipo: 'preventivo',
          estado: 'pendiente',
          fechaIngreso: fechaInicial,
        });
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.mantenimientoForm.invalid) {
      this.mantenimientoForm.markAllAsTouched();
      return;
    }

    const formValue = this.mantenimientoForm.value;
    const formData: MantenimientoCreateDto | MantenimientoUpdateDto = {
      vehiculoId: formValue.vehiculo?.id
        ? Number(formValue.vehiculo.id)
        : Number(formValue.vehiculo),
      tallerId: formValue.taller?.id ? Number(formValue.taller.id) : Number(formValue.taller),
      tipo: formValue.tipo,
      costoTotal: String(formValue.costoTotal),
      descripcion: formValue.descripcion,
      fechaIngreso: formValue.fechaIngreso ? `${formValue.fechaIngreso}:00.000Z` : '',
      fechaSalida: formValue.fechaSalida ? `${formValue.fechaSalida}:00.000Z` : '',
      kilometraje: Number(formValue.kilometraje),
      estado: formValue.estado,
    };

    this.onSubmitForm.emit(formData);
  }

  // Formatea una fecha al formato YYYY-MM-DDTHH:mm para el input type="datetime-local"
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
}
