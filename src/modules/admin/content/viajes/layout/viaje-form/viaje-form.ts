import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeResultDto, ViajeCreateDto, ViajeUpdateDto, EstadoViaje } from '@interface/admin/viaje.interface';
import { RutaResultDto } from '@interface/admin/ruta.interface';
import { VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { ConductorResultDto } from '@interface/admin/conductor.interface';
import { RutaService } from '@service/admin/ruta.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ConductorService } from '@service/admin/conductor.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-viaje-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viaje-form.html',
  styleUrl: './viaje-form.css',
})
export class ViajeForm implements OnInit {
  private fb = inject(FormBuilder);
  private rutaService = inject(RutaService);
  private vehiculoService = inject(VehiculoService);
  private conductorService = inject(ConductorService);

  // Inputs
  viaje = input<ViajeResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ViajeCreateDto | ViajeUpdateDto>();

  // Catálogos
  rutas = signal<RutaResultDto[]>([]);
  vehiculos = signal<VehiculoResultDto[]>([]);
  conductores = signal<ConductorResultDto[]>([]);
  loadingCatalogos = signal(false);

  viajeForm: FormGroup = this.fb.group({
    rutaId: ['', [Validators.required]],
    vehiculoId: ['', [Validators.required]],
    conductorId: ['', [Validators.required]],
    fechaSalida: ['', [Validators.required]],
    fechaLlegada: [''],
    estado: ['programado', [Validators.required]],
  });

  estados: Array<{ value: EstadoViaje; label: string; icon: string; color: string }> = [
    { value: 'programado', label: 'Programado', icon: 'fa-clock', color: 'text-info' },
    { value: 'en_progreso', label: 'En Progreso', icon: 'fa-truck', color: 'text-warning' },
    { value: 'completado', label: 'Completado', icon: 'fa-check-circle', color: 'text-success' },
    { value: 'cancelado', label: 'Cancelado', icon: 'fa-times-circle', color: 'text-danger' },
  ];

  ngOnInit() {
    this.loadCatalogos();
  }

  loadCatalogos() {
    this.loadingCatalogos.set(true);

    forkJoin({
      rutas: this.rutaService.findAll(),
      vehiculos: this.vehiculoService.findAll(),
      conductores: this.conductorService.findAll(),
    }).subscribe({
      next: ({ rutas, vehiculos, conductores }) => {
        this.rutas.set(rutas);
        this.conductores.set(conductores);

        // Si estamos editando, incluir el vehículo actual aunque no esté activo
        const viajeData = this.viaje();
        if (this.editMode() && viajeData) {
          const vehiculosActivos = vehiculos.filter(v => v.estado === 'activo');
          const vehiculoActual = vehiculos.find(v => v.id === viajeData.vehiculoId);

          // Si el vehículo actual no está en la lista de activos, agregarlo
          if (vehiculoActual && !vehiculosActivos.some(v => v.id === vehiculoActual.id)) {
            this.vehiculos.set([...vehiculosActivos, vehiculoActual]);
          } else {
            this.vehiculos.set(vehiculosActivos);
          }

          // Ahora que los catálogos están cargados, setear el formulario
          this.viajeForm.patchValue({
            rutaId: viajeData.rutaId,
            vehiculoId: viajeData.vehiculoId,
            conductorId: viajeData.conductorId,
            fechaSalida: this.formatDateTimeLocal(viajeData.fechaSalida),
            fechaLlegada: viajeData.fechaLlegada ? this.formatDateTimeLocal(viajeData.fechaLlegada) : '',
            estado: viajeData.estado,
          });
        } else {
          // Para crear nuevo viaje, solo mostrar vehículos activos
          this.vehiculos.set(vehiculos.filter(v => v.estado === 'activo'));
          this.viajeForm.reset({ estado: 'programado' });
        }

        this.loadingCatalogos.set(false);
      },
      error: (err) => {
        console.error('Error cargando catálogos:', err);
        this.loadingCatalogos.set(false);
      },
    });
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
    const formData: ViajeCreateDto | ViajeUpdateDto = {
      rutaId: Number(formValue.rutaId),
      vehiculoId: Number(formValue.vehiculoId),
      conductorId: Number(formValue.conductorId),
      fechaSalida: new Date(formValue.fechaSalida).toISOString(),
      fechaLlegada: formValue.fechaLlegada ? new Date(formValue.fechaLlegada).toISOString() : null,
      estado: formValue.estado,
    };

    this.onSubmitForm.emit(formData);
  }
}
