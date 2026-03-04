import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SucursalService } from '@service/admin/sucursal.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { SucursalForm } from '../../layout/sucursal-form/sucursal-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-sucursales-list',
  imports: [CommonModule, FormsModule, ModalForm, SucursalForm, PaginationComponent],
  templateUrl: './sucursales-list.html',
  styleUrl: './sucursales-list.css',
})
export class SucursalesList implements OnInit, OnDestroy {
  private sucursalService = inject(SucursalService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  sucursales = signal<ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);
  viewMode = signal<'grid' | 'table'>('table');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'talleres', 'findAllSucursalesPaginated'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');

  sucursalFormComponent = viewChild<SucursalForm>(SucursalForm);

  ngOnInit() {
    this.loadSucursales();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadSucursales() {
    this.loading.set(true);
    this.sucursalService
      .findAllPaginated({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
      })
      .then((response) => {
        this.sucursales.set(response.data);
        this.meta.set(response.meta);
      })
      .catch((error) => {
        console.error('Error al cargar sucursales:', error);
        this.toastService.error('Error al cargar sucursales');
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadSucursales();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadSucursales();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadSucursales();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.loadSucursales();
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(sucursal: ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data'][number]) {
    const path = buildPath(PATH.admin.sucursales.edit).replace(':id', sucursal.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(
    data: ApiBody<'talleres', 'createSucursal'> | ApiBody<'talleres', 'updateSucursal'>,
  ) {
    this.createSucursal(data as ApiBody<'talleres', 'createSucursal'>);
  }

  handleModalSubmit() {
    this.sucursalFormComponent()?.submitForm();
  }

  createSucursal(data: ApiBody<'talleres', 'createSucursal'>) {
    this.loading.set(true);
    this.sucursalService
      .create(data)
      .then(() => {
        this.toastService.success('Sucursal creada exitosamente');
        this.loadSucursales();
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al crear sucursal:', error);
        this.toastService.error(getErrorMessage(error, 'Error al crear sucursal'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  deleteSucursal(id: number) {
    this.alertService.delete(
      'Eliminar Sucursal',
      '¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.sucursalService
          .delete(id)
          .then(() => {
            this.toastService.success('Sucursal eliminada exitosamente');
            this.loadSucursales();
          })
          .catch((error) => {
            console.error('Error al eliminar sucursal:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar sucursal'));
          })
          .finally(() => {
            this.loading.set(false);
          });
      },
    );
  }
}
