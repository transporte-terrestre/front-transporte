import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ViajeResultDto,
  ViajeCreateDto,
  ViajeUpdateDto,
  ViajeEstado,
  ViajeModalidadServicio,
} from '@interface/admin/viaje.interface';
import { RutaResultDto } from '@interface/admin/ruta.interface';
import { VehiculoListDto, VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { ConductorListDto, ConductorResultDto } from '@interface/admin/conductor.interface';
import { RutaService } from '@service/admin/ruta.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ConductorService } from '@service/admin/conductor.service';
import { ClienteService } from '@service/admin/cliente.service';
import { ClienteListDto, ClienteResultDto } from '@interface/admin/cliente.interface';
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

  private clienteService = inject(ClienteService);

  // Inputs
  viaje = input<ViajeResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<any>(); // Emits combined data

  // Catálogos
  rutas = signal<RutaResultDto[]>([]);
  vehiculos = signal<VehiculoListDto[]>([]);
  conductores = signal<ConductorListDto[]>([]);
  clientes = signal<ClienteListDto[]>([]);
  loadingCatalogos = signal(false);

  viajeForm: FormGroup = this.fb.group({
    clienteId: ['', [Validators.required]],
    tipoRuta: ['fija', [Validators.required]],
    rutaId: [''],
    rutaOcasional: [''],
    modalidadServicio: ['regular', [Validators.required]],
    vehiculoId: ['', [Validators.required]],
    conductorId: ['', [Validators.required]],
    fechaSalida: ['', [Validators.required]],
    fechaLlegada: [''],
    estado: ['programado', [Validators.required]],
  });

  estados: Array<{ value: ViajeEstado; label: string; icon: string; color: string }> = [
    { value: 'programado', label: 'Programado', icon: 'fa-clock', color: 'text-info' },
    { value: 'en_progreso', label: 'En Progreso', icon: 'fa-truck', color: 'text-warning' },
    { value: 'completado', label: 'Completado', icon: 'fa-check-circle', color: 'text-success' },
    { value: 'cancelado', label: 'Cancelado', icon: 'fa-times-circle', color: 'text-danger' },
  ];

  modalidades: Array<{ value: ViajeModalidadServicio; label: string }> = [
    { value: 'regular', label: 'Regular' },
    { value: 'expreso', label: 'Expreso' },
    { value: 'ejecutivo', label: 'Ejecutivo' },
    { value: 'especial', label: 'Especial' },
    { value: 'turismo', label: 'Turismo' },
  ];

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
    this.loadingCatalogos.set(true);

    forkJoin({
      rutas: this.rutaService.findAll({ limit: 1000 }),
      vehiculos: this.vehiculoService.findAll({ limit: 1000 }),
      conductores: this.conductorService.findAll({ limit: 1000 }),
      clientes: this.clienteService.findAll({ limit: 1000 }),
    }).subscribe({
      next: ({ rutas, vehiculos, conductores, clientes }) => {
        this.rutas.set(rutas.data);
        this.conductores.set(conductores.data);
        this.clientes.set(clientes.data);

        // Si estamos editando, incluir el vehículo actual aunque no esté activo
        const viajeData = this.viaje();
        if (this.editMode() && viajeData) {
          const vehiculosActivos = vehiculos.data.filter((v) => v.estado === 'activo');
          // Buscar el vehículo principal del viaje si existe
          const vehiculoId = viajeData.vehiculos?.[0]?.vehiculoId;

          // Nota: vehiculoActual aquí sería un VehiculoListDto si lo encontramos en la lista,
          // pero si necesitamos datos extra que no están en el listado, tendríamos que hacer otra llamada.
          // Por ahora asumimos que la lista tiene lo necesario para el select.
          const vehiculoActual = vehiculoId
            ? vehiculos.data.find((v) => v.id === vehiculoId)
            : null;

          if (vehiculoActual && !vehiculosActivos.some((v) => v.id === vehiculoActual.id)) {
            this.vehiculos.set([...vehiculosActivos, vehiculoActual]);
          } else {
            this.vehiculos.set(vehiculosActivos);
          }

          // Setear formulario
          this.viajeForm.patchValue({
            clienteId: viajeData.clienteId,
            tipoRuta: viajeData.tipoRuta,
            rutaId: viajeData.rutaId,
            rutaOcasional: viajeData.rutaOcasional,
            modalidadServicio: viajeData.modalidadServicio,
            vehiculoId: viajeData.vehiculos?.[0]?.vehiculoId,
            conductorId: viajeData.conductores?.[0]?.conductorId,
            fechaSalida: this.formatDateTimeLocal(viajeData.fechaSalida),
            fechaLlegada: viajeData.fechaLlegada
              ? this.formatDateTimeLocal(viajeData.fechaLlegada)
              : '',
            estado: viajeData.estado,
          });
        } else {
          this.vehiculos.set(vehiculos.data.filter((v) => v.estado === 'activo'));
          this.viajeForm.reset({
            estado: 'programado',
            tipoRuta: 'fija',
            modalidadServicio: 'regular',
          });
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
    const formData = {
      ...formValue,
      rutaId: formValue.rutaId ? Number(formValue.rutaId) : undefined,
      vehiculoId: Number(formValue.vehiculoId),
      conductorId: Number(formValue.conductorId),
      clienteId: Number(formValue.clienteId),
      fechaSalida: new Date(formValue.fechaSalida).toISOString(),
      fechaLlegada: formValue.fechaLlegada ? new Date(formValue.fechaLlegada).toISOString() : null,
    };

    this.onSubmitForm.emit(formData);
  }
}
