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
import { VehiculoResultDto, VehiculoListDto } from '@interface/admin/vehiculo.interface';
import { TallerResultDto } from '@interface/admin/taller.interface';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { TallerService } from '@service/admin/taller.service';

@Component({
  selector: 'app-mantenimiento-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mantenimiento-form.html',
  styleUrl: './mantenimiento-form.css',
})
export class MantenimientoForm implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private tallerService = inject(TallerService);

  // Inputs
  mantenimiento = input<MantenimientoResultDto | null>(null);
  editMode = input<boolean>(false);
  selectedDate = input<Date | null>(null);

  // Outputs
  onSubmitForm = output<MantenimientoCreateDto | MantenimientoUpdateDto>();

  // Catálogos
  vehiculos = signal<VehiculoListDto[]>([]);
  talleres = signal<TallerResultDto[]>([]);
  loadingCatalogos = signal(false);

  mantenimientoForm: FormGroup = this.fb.group({
    vehiculoId: ['', [Validators.required]],
    tallerId: ['', [Validators.required]],
    codigoOrden: ['', [Validators.required]],
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
          vehiculoId: mantenimientoData.vehiculoId,
          tallerId: mantenimientoData.tallerId,
          codigoOrden: mantenimientoData.codigoOrden,
          tipo: mantenimientoData.tipo,
          costoTotal: mantenimientoData.costoTotal,
          descripcion: mantenimientoData.descripcion,
          fechaIngreso: mantenimientoData.fechaIngreso.split('T')[0],
          fechaSalida: mantenimientoData.fechaSalida.split('T')[0],
          kilometraje: mantenimientoData.kilometraje,
          estado: mantenimientoData.estado,
        });
      } else {
        // Si hay una fecha seleccionada del calendario, usarla
        const fechaInicial = dateSelected ? this.formatDateForInput(dateSelected) : '';
        this.mantenimientoForm.reset({
          tipo: 'preventivo',
          estado: 'pendiente',
          fechaIngreso: fechaInicial,
        });
      }
    });
  }

  ngOnInit() {
    this.loadCatalogos();
  }

  loadCatalogos() {
    this.loadingCatalogos.set(true);

    this.vehiculoService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        this.vehiculos.set(response.data);
      },
      error: (err) => {
        console.error('Error cargando vehículos:', err);
      },
    });

    this.tallerService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        this.talleres.set(response.data);
        this.loadingCatalogos.set(false);
      },
      error: (err) => {
        console.error('Error cargando talleres:', err);
        this.loadingCatalogos.set(false);
      },
    });
  }

  submitForm() {
    if (this.mantenimientoForm.invalid) {
      this.mantenimientoForm.markAllAsTouched();
      return;
    }

    const formValue = this.mantenimientoForm.value;
    const formData: MantenimientoCreateDto | MantenimientoUpdateDto = {
      vehiculoId: Number(formValue.vehiculoId),
      tallerId: Number(formValue.tallerId),
      codigoOrden: formValue.codigoOrden,
      tipo: formValue.tipo,
      costoTotal: String(formValue.costoTotal),
      descripcion: formValue.descripcion,
      fechaIngreso: new Date(formValue.fechaIngreso).toISOString(),
      fechaSalida: new Date(formValue.fechaSalida).toISOString(),
      kilometraje: Number(formValue.kilometraje),
      estado: formValue.estado,
    };

    this.onSubmitForm.emit(formData);
  }

  // Formatea una fecha al formato YYYY-MM-DD para el input type="date"
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
