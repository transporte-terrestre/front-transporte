import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { VehiculoLineaForm } from './layout/vehiculo-linea-form/vehiculo-linea-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-vehiculos-lineas',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalForm, VehiculoLineaForm, PaginationComponent],
  templateUrl: './vehiculos-lineas.html',
  styleUrl: './vehiculos-lineas.css',
})
export class VehiculosLineas implements OnInit, OnDestroy {
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  marcas = signal<ApiResponse<'vehiculos', 'findAllMarcas'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Edit mode
  selectedMarca = signal<ApiResponse<'vehiculos', 'findOneMarca'> | null>(null);
  editMode = signal(false);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'vehiculos', 'findAllMarcas'>['meta'] | null>(null);

  // Filters
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  vehiculoLineaFormComponent = viewChild<VehiculoLineaForm>(VehiculoLineaForm);

  ngOnInit() {
    this.loadMarcas();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadMarcas();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  async loadMarcas() {
    this.loading.set(true);
    try {
      const response = await this.vehiculoService.findAllMarcas({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      });
      this.marcas.set(response.data);
      this.meta.set(response.meta);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar marcas:', error);
      this.toastService.error('Error al cargar marcas');
      this.loading.set(false);
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.currentPage.set(1);
    this.loadMarcas();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadMarcas();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadMarcas();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadMarcas();
  }

  openCreateModal() {
    this.selectedMarca.set(null);
    this.editMode.set(false);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedMarca.set(null);
    this.editMode.set(false);
  }

  handleModalSubmit() {
    this.vehiculoLineaFormComponent()?.submitForm();
  }

  handleFormSuccess() {
    this.loadMarcas();
    this.closeModal();
  }

  openEditModal(marca: ApiResponse<'vehiculos', 'findAllMarcas'>['data'][number]) {
    this.selectedMarca.set(marca);
    this.editMode.set(true);
    this.showModal.set(true);
  }

  // ...

  deleteMarca(id: number) {
    this.alertService.delete(
      'Eliminar Marca',
      '¿Estás seguro de que deseas eliminar esta marca? Se eliminarán también todos los modelos asociados.',
      async () => {
        this.loading.set(true);
        try {
          await this.vehiculoService.deleteMarca(id);
          this.toastService.success('Marca eliminada exitosamente');
          this.loadMarcas();
        } catch (error) {
          console.error('Error al eliminar marca:', error);
          this.toastService.error('Error al eliminar marca');
          this.loading.set(false);
        }
      }
    );
  }

  navigateToVehiculos() {
    const path = buildPath(PATH.admin.vehiculos.list);
    this.router.navigate([path]);
  }
}
