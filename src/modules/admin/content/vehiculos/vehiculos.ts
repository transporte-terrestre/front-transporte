import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { VehiculoResultDto, VehiculoCreateDto, VehiculoUpdateDto } from '@interface/admin/vehiculo.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { VehiculoForm } from './layout/vehiculo-form/vehiculo-form';

@Component({
  selector: 'app-vehiculos',
  imports: [CommonModule, FormsModule, ModalForm, VehiculoForm],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css',
})
export class Vehiculos implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  vehiculos = signal<VehiculoResultDto[]>([]);
  filteredVehiculos = signal<VehiculoResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedVehiculo = signal<VehiculoResultDto | null>(null);
  searchTerm = '';
  viewMode = signal<'grid' | 'table'>('grid');

  vehiculoFormComponent = viewChild<VehiculoForm>(VehiculoForm);

  ngOnInit() {
    this.loadVehiculos();
  }

  loadVehiculos() {
    this.loading.set(true);
    this.vehiculoService.findAll().subscribe({
      next: (data) => {
        this.vehiculos.set(data);
        this.filteredVehiculos.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
        this.toastService.error('Error al cargar vehículos');
        this.loading.set(false);
      },
    });
  }

  filterVehiculos() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredVehiculos.set(this.vehiculos());
      return;
    }

    const filtered = this.vehiculos().filter(vehiculo =>
      vehiculo.placa.toLowerCase().includes(term) ||
      vehiculo.marca.toLowerCase().includes(term) ||
      vehiculo.modelo.toLowerCase().includes(term) ||
      vehiculo.estado.toLowerCase().includes(term)
    );
    this.filteredVehiculos.set(filtered);
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.editMode.set(false);
    this.selectedVehiculo.set(null);
    this.showModal.set(true);
  }

  openEditModal(vehiculo: VehiculoResultDto) {
    this.editMode.set(true);
    this.selectedVehiculo.set(vehiculo);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedVehiculo.set(null);
  }

  handleFormSubmit(data: VehiculoCreateDto | VehiculoUpdateDto) {
    if (this.editMode()) {
      this.updateVehiculo(this.selectedVehiculo()!.id, data as VehiculoUpdateDto);
    } else {
      this.createVehiculo(data as VehiculoCreateDto);
    }
  }

  handleModalSubmit() {
    this.vehiculoFormComponent()?.submitForm();
  }

  createVehiculo(data: VehiculoCreateDto) {
    this.loading.set(true);
    this.vehiculoService.create(data).subscribe({
      next: () => {
        this.toastService.success('Vehículo creado exitosamente');
        this.loadVehiculos();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear vehículo:', error);
        this.toastService.error('Error al crear vehículo');
        this.loading.set(false);
      },
    });
  }

  updateVehiculo(id: number, data: VehiculoUpdateDto) {
    this.loading.set(true);
    this.vehiculoService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Vehículo actualizado exitosamente');
        this.loadVehiculos();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar vehículo:', error);
        this.toastService.error('Error al actualizar vehículo');
        this.loading.set(false);
      },
    });
  }

  deleteVehiculo(id: number) {
    this.alertService.delete(
      'Eliminar Vehículo',
      '¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.vehiculoService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Vehículo eliminado exitosamente');
            this.loadVehiculos();
          },
          error: (error) => {
            console.error('Error al eliminar vehículo:', error);
            this.toastService.error('Error al eliminar vehículo');
            this.loading.set(false);
          },
        });
      }
    );
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'bg-success/10 text-success';
      case 'taller':
        return 'bg-warning/10 text-warning';
      case 'retirado':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'fa-check-circle';
      case 'taller':
        return 'fa-wrench';
      case 'retirado':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  }

  isSoatExpiring(fecha: string): boolean {
    const soatDate = new Date(fecha);
    const today = new Date();
    const diffTime = soatDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }

  isSoatExpired(fecha: string): boolean {
    const soatDate = new Date(fecha);
    const today = new Date();
    return soatDate < today;
  }
}
