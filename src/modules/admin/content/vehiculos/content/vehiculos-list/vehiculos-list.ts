import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { VehiculoForm } from '../../layout/vehiculo-form/vehiculo-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-vehiculos-list',
  imports: [CommonModule, FormsModule, ModalForm, VehiculoForm, PaginationComponent],
  templateUrl: './vehiculos-list.html',
  styleUrl: './vehiculos-list.css',
})
export class VehiculosList implements OnInit, OnDestroy {
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  vehiculos = signal<ApiResponse<'vehiculos', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);
  viewMode = signal<'grid' | 'table'>('table');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'vehiculos', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  vehiculoFormComponent = viewChild<VehiculoForm>(VehiculoForm);

  ngOnInit() {
    this.loadVehiculos();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  async loadVehiculos() {
    this.loading.set(true);
    try {
      const response = await this.vehiculoService.findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      });
      this.vehiculos.set(response.data);
      this.meta.set(response.meta);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      this.toastService.error('Error al cargar vehículos');
      this.loading.set(false);
    }
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadVehiculos();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.onSearch();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadVehiculos();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadVehiculos();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadVehiculos();
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToLineas() {
    const path = buildPath(PATH.admin.vehiculos.lineas);
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleModalSubmit() {
    this.vehiculoFormComponent()?.submitForm();
  }

  navigateToEdit(vehiculo: ApiResponse<'vehiculos', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.vehiculos.edit).replace(':id', vehiculo.id.toString());
    this.router.navigate([path]);
  }

  handleFormSubmit(data: ApiBody<'vehiculos', 'create'> | ApiBody<'vehiculos', 'update'>) {
    this.createVehiculo(data);
  }

  async createVehiculo(data: ApiBody<'vehiculos', 'create'> | ApiBody<'vehiculos', 'update'>) {
    this.loading.set(true);
    try {
      await this.vehiculoService.create(data as ApiBody<'vehiculos', 'create'>);
      this.toastService.success('Vehículo creado exitosamente');
      this.loadVehiculos();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      this.toastService.error('Error al crear vehículo');
      this.loading.set(false);
    }
  }

  deleteVehiculo(id: number) {
    this.alertService.delete(
      'Eliminar Vehículo',
      '¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.vehiculoService.delete(id).then(
          () => {
            this.toastService.success('Vehículo eliminado exitosamente');
            this.loadVehiculos();
          },
          (error) => {
            console.error('Error al eliminar vehículo:', error);
            this.toastService.error('Error al eliminar vehículo');
            this.loading.set(false);
          }
        );
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
}
