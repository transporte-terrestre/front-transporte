import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MantenimientoResultDto, MantenimientoCreateDto, MantenimientoUpdateDto, TipoMantenimiento } from '@interface/admin/mantenimiento.interface';
import { VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { VehiculoService } from '@service/admin/vehiculo.service';

@Component({
  selector: 'app-mantenimiento-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mantenimiento-form.html',
  styleUrl: './mantenimiento-form.css',
})
export class MantenimientoForm implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);

  // Inputs
  mantenimiento = input<MantenimientoResultDto | null>(null);
  editMode = input<boolean>(false);
  selectedDate = input<Date | null>(null);

  // Outputs
  onSubmitForm = output<MantenimientoCreateDto | MantenimientoUpdateDto>();

  // Catálogos
  vehiculos = signal<VehiculoResultDto[]>([]);
  loadingCatalogos = signal(false);

  mantenimientoForm: FormGroup = this.fb.group({
    vehiculoId: ['', [Validators.required]],
    tipo: ['preventivo', [Validators.required]],
    costo: ['', [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fecha: ['', [Validators.required]],
    kilometraje: ['', [Validators.required, Validators.min(0)]],
    proveedor: ['', [Validators.required, Validators.minLength(3)]],
  });

  tipos: Array<{ value: TipoMantenimiento; label: string; icon: string; color: string }> = [
    { value: 'preventivo', label: 'Preventivo', icon: 'fa-shield-alt', color: 'text-info' },
    { value: 'correctivo', label: 'Correctivo', icon: 'fa-wrench', color: 'text-warning' },
  ];

  constructor() {
    effect(() => {
      const mantenimientoData = this.mantenimiento();
      const isEditMode = this.editMode();
      const dateSelected = this.selectedDate();

      if (isEditMode && mantenimientoData) {
        this.mantenimientoForm.patchValue({
          vehiculoId: mantenimientoData.vehiculoId,
          tipo: mantenimientoData.tipo,
          costo: mantenimientoData.costo,
          descripcion: mantenimientoData.descripcion,
          fecha: mantenimientoData.fecha,
          kilometraje: mantenimientoData.kilometraje,
          proveedor: mantenimientoData.proveedor,
        });
      } else {
        // Si hay una fecha seleccionada del calendario, usarla
        const fechaInicial = dateSelected ? this.formatDateForInput(dateSelected) : '';
        this.mantenimientoForm.reset({
          tipo: 'preventivo',
          fecha: fechaInicial
        });
      }
    });
  }

  ngOnInit() {
    this.loadCatalogos();
  }

  loadCatalogos() {
    this.loadingCatalogos.set(true);

    this.vehiculoService.findAll().subscribe({
      next: (data) => {
        this.vehiculos.set(data);
        this.loadingCatalogos.set(false);
      },
      error: (err) => {
        console.error('Error cargando vehículos:', err);
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
      tipo: formValue.tipo,
      costo: String(formValue.costo),
      descripcion: formValue.descripcion,
      fecha: formValue.fecha,
      kilometraje: Number(formValue.kilometraje),
      proveedor: formValue.proveedor,
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
