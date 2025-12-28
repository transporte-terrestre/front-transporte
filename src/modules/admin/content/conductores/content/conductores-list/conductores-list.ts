import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConductorService } from '@service/admin/conductor.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { ConductorForm } from '../../layout/conductor-form/conductor-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-conductores-list',
  imports: [CommonModule, FormsModule, ModalForm, ConductorForm, PaginationComponent],
  templateUrl: './conductores-list.html',
  styleUrl: './conductores-list.css',
})
export class ConductoresList implements OnInit, OnDestroy {
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  conductores = signal<ApiResponse<'conductores', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'conductores', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  conductorFormComponent = viewChild<ConductorForm>(ConductorForm);

  ngOnInit() {
    this.loadConductores();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadConductores() {
    this.loading.set(true);
    this.conductorService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.conductores.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar conductores:', error);
        this.toastService.error('Error al cargar conductores');
        this.loading.set(false);
      });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadConductores();
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
    this.loadConductores();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadConductores();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadConductores();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(conductor: ApiResponse<'conductores', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.conductores.edit).replace(':id', conductor.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ApiBody<'conductores', 'create'> | ApiBody<'conductores', 'update'>) {
    this.createConductor(data as ApiBody<'conductores', 'create'>);
  }

  handleModalSubmit() {
    this.conductorFormComponent()?.submitForm();
  }

  createConductor(data: ApiBody<'conductores', 'create'>) {
    this.loading.set(true);
    this.conductorService
      .create(data)
      .then(() => {
        this.toastService.success('Conductor creado exitosamente');
        this.loadConductores();
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al crear conductor:', error);
        this.toastService.error('Error al crear conductor');
        this.loading.set(false);
      });
  }

  deleteConductor(id: number) {
    this.alertService.delete(
      'Eliminar Conductor',
      '¿Estás seguro de que deseas eliminar este conductor? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.conductorService
          .delete(id)
          .then(() => {
            this.toastService.success('Conductor eliminado exitosamente');
            this.loadConductores();
          })
          .catch((error) => {
            console.error('Error al eliminar conductor:', error);
            this.toastService.error('Error al eliminar conductor');
            this.loading.set(false);
          });
      }
    );
  }
}
