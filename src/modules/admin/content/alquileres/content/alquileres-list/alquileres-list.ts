import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { AlquilerForm } from '../../layout/alquiler-form/alquiler-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { AlquilerEstadoUpdate } from './layout/alquiler-estado-update/alquiler-estado-update';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-alquileres-list',
  imports: [
    CommonModule,
    FormsModule,
    ModalForm,
    AlquilerForm,
    PaginationComponent,
    AlquilerEstadoUpdate,
  ],
  templateUrl: './alquileres-list.html',
  styleUrl: './alquileres-list.css',
})
export class AlquileresList implements OnInit {
  private alquilerService = inject(AlquilerService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  private searchSubject = new Subject<string>();

  alquileres = signal<ApiResponse<'alquileres', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'alquileres', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');

  formComponent = viewChild<AlquilerForm>('formComponent');

  ngOnInit() {
    this.loadAlquileres();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  async loadAlquileres() {
    this.loading.set(true);
    try {
      const response = await this.alquilerService.findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
      });
      this.alquileres.set(response.data);
      this.meta.set(response.meta);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar alquileres:', error);
      this.toastService.error(getErrorMessage(error, 'Error al cargar alquileres'));
      this.loading.set(false);
    }
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadAlquileres();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadAlquileres();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadAlquileres();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.loadAlquileres();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'>) {
    this.createAlquiler(data);
  }

  async createAlquiler(data: ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'>) {
    this.loading.set(true);
    try {
      await this.alquilerService.create(data as ApiBody<'alquileres', 'create'>);
      this.toastService.success('Alquiler creado exitosamente');
      this.loadAlquileres();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear alquiler:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear alquiler'));
      this.loading.set(false);
    }
  }

  navigateToEdit(alquiler: ApiResponse<'alquileres', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.alquileres.edit).replace(':id', alquiler.id.toString());
    this.router.navigate([path]);
  }

  deleteAlquiler(id: number, event: Event) {
    event.stopPropagation();
    this.alertService.delete(
      'Eliminar Alquiler',
      '¿Estás seguro de que deseas eliminar este alquiler? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.alquilerService.delete(id).then(
          () => {
            this.toastService.success('Alquiler eliminado exitosamente');
            this.loadAlquileres();
          },
          (error) => {
            console.error('Error al eliminar alquiler:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar alquiler'));
            this.loading.set(false);
          },
        );
      },
    );
  }

  getDiffDias(start: string | Date, end: string | Date): number {
    const pStart = new Date(start);
    const pEnd = new Date(end);
    const diffTime = Math.abs(pEnd.getTime() - pStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
