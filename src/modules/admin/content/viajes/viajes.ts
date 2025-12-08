import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { RutaService } from '@service/admin/ruta.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ConductorService } from '@service/admin/conductor.service';
import { ViajeResultDto, ViajeCreateDto, ViajeUpdateDto, EstadoViaje } from '@interface/admin/viaje.interface';
import { RutaResultDto } from '@interface/admin/ruta.interface';
import { VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { ConductorResultDto } from '@interface/admin/conductor.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { ViajeForm } from './layout/viaje-form/viaje-form';

@Component({
  selector: 'app-viajes',
  imports: [CommonModule, FormsModule, ModalForm, ViajeForm],
  templateUrl: './viajes.html',
  styleUrl: './viajes.css',
})
export class Viajes implements OnInit {
  private viajeService = inject(ViajeService);
  private rutaService = inject(RutaService);
  private vehiculoService = inject(VehiculoService);
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  viajes = signal<ViajeResultDto[]>([]);
  filteredViajes = signal<ViajeResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedViaje = signal<ViajeResultDto | null>(null);
  searchTerm = '';
  viewMode = signal<'grid' | 'table'>('grid');

  // Catálogos para mostrar nombres en lugar de IDs
  rutas = signal<Map<number, RutaResultDto>>(new Map());
  vehiculos = signal<Map<number, VehiculoResultDto>>(new Map());
  conductores = signal<Map<number, ConductorResultDto>>(new Map());

  viajeFormComponent = viewChild<ViajeForm>(ViajeForm);

  ngOnInit() {
    this.loadCatalogos();
    this.loadViajes();
  }

  loadCatalogos() {
    this.rutaService.findAll().subscribe({
      next: (data) => {
        const map = new Map<number, RutaResultDto>();
        data.forEach(r => map.set(r.id, r));
        this.rutas.set(map);
      },
    });

    this.vehiculoService.findAll().subscribe({
      next: (data) => {
        const map = new Map<number, VehiculoResultDto>();
        data.forEach(v => map.set(v.id, v));
        this.vehiculos.set(map);
      },
    });

    this.conductorService.findAll().subscribe({
      next: (data) => {
        const map = new Map<number, ConductorResultDto>();
        data.forEach(c => map.set(c.id, c));
        this.conductores.set(map);
      },
    });
  }

  loadViajes() {
    this.loading.set(true);
    this.viajeService.findAll().subscribe({
      next: (data) => {
        this.viajes.set(data);
        this.filteredViajes.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
        this.toastService.error('Error al cargar viajes');
        this.loading.set(false);
      },
    });
  }

  filterViajes() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredViajes.set(this.viajes());
      return;
    }

    const filtered = this.viajes().filter(viaje => {
      const ruta = this.rutas().get(viaje.rutaId);
      const vehiculo = this.vehiculos().get(viaje.vehiculoId);
      const conductor = this.conductores().get(viaje.conductorId);

      return (
        ruta?.origen.toLowerCase().includes(term) ||
        ruta?.destino.toLowerCase().includes(term) ||
        vehiculo?.placa.toLowerCase().includes(term) ||
        conductor?.nombre.toLowerCase().includes(term) ||
        viaje.estado.toLowerCase().includes(term)
      );
    });
    this.filteredViajes.set(filtered);
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.editMode.set(false);
    this.selectedViaje.set(null);
    this.showModal.set(true);
  }

  openEditModal(viaje: ViajeResultDto) {
    this.editMode.set(true);
    this.selectedViaje.set(viaje);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedViaje.set(null);
  }

  handleFormSubmit(data: ViajeCreateDto | ViajeUpdateDto) {
    if (this.editMode()) {
      this.updateViaje(this.selectedViaje()!.id, data as ViajeUpdateDto);
    } else {
      this.createViaje(data as ViajeCreateDto);
    }
  }

  handleModalSubmit() {
    this.viajeFormComponent()?.submitForm();
  }

  createViaje(data: ViajeCreateDto) {
    this.loading.set(true);
    this.viajeService.create(data).subscribe({
      next: () => {
        this.toastService.success('Viaje creado exitosamente');
        this.loadViajes();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear viaje:', error);
        this.toastService.error('Error al crear viaje');
        this.loading.set(false);
      },
    });
  }

  updateViaje(id: number, data: ViajeUpdateDto) {
    this.loading.set(true);
    this.viajeService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Viaje actualizado exitosamente');
        this.loadViajes();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar viaje:', error);
        this.toastService.error('Error al actualizar viaje');
        this.loading.set(false);
      },
    });
  }

  deleteViaje(id: number) {
    this.alertService.delete(
      'Eliminar Viaje',
      '¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.viajeService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Viaje eliminado exitosamente');
            this.loadViajes();
          },
          error: (error) => {
            console.error('Error al eliminar viaje:', error);
            this.toastService.error('Error al eliminar viaje');
            this.loading.set(false);
          },
        });
      }
    );
  }

  getRutaDisplay(rutaId: number): string {
    const ruta = this.rutas().get(rutaId);
    return ruta ? `${ruta.origen} → ${ruta.destino}` : `Ruta #${rutaId}`;
  }

  getVehiculoDisplay(vehiculoId: number): string {
    const vehiculo = this.vehiculos().get(vehiculoId);
    return vehiculo ? `${vehiculo.placa} - ${vehiculo.marca}` : `Vehículo #${vehiculoId}`;
  }

  getConductorDisplay(conductorId: number): string {
    const conductor = this.conductores().get(conductorId);
    return conductor ? conductor.nombre : `Conductor #${conductorId}`;
  }

  getEstadoBadgeClass(estado: EstadoViaje): string {
    switch (estado) {
      case 'programado':
        return 'bg-info/10 text-info';
      case 'en_progreso':
        return 'bg-warning/10 text-warning';
      case 'completado':
        return 'bg-success/10 text-success';
      case 'cancelado':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: EstadoViaje): string {
    switch (estado) {
      case 'programado':
        return 'fa-clock';
      case 'en_progreso':
        return 'fa-truck';
      case 'completado':
        return 'fa-check-circle';
      case 'cancelado':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  }

  getEstadoLabel(estado: EstadoViaje): string {
    switch (estado) {
      case 'programado':
        return 'Programado';
      case 'en_progreso':
        return 'En Progreso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
