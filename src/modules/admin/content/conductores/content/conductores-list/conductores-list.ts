import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConductorService } from '@service/admin/conductor.service';
import {
  ConductorListDto,
  ConductorCreateDto,
  PaginationMeta,
} from '@interface/admin/conductor.interface';
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

  conductores = signal<ConductorListDto[]>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<PaginationMeta | null>(null);

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
      .subscribe({
        next: (response) => {
          this.conductores.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar conductores:', error);
          this.toastService.error('Error al cargar conductores');
          this.loading.set(false);
        },
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

  navigateToEdit(conductor: ConductorListDto) {
    const path = buildPath(PATH.admin.conductores.edit).replace(':id', conductor.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: any) {
    this.createConductor(data as ConductorCreateDto);
  }

  handleModalSubmit() {
    this.conductorFormComponent()?.submitForm();
  }

  createConductor(data: ConductorCreateDto) {
    this.loading.set(true);
    this.conductorService.create(data).subscribe({
      next: () => {
        this.toastService.success('Conductor creado exitosamente');
        this.loadConductores();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear conductor:', error);
        this.toastService.error('Error al crear conductor');
        this.loading.set(false);
      },
    });
  }

  deleteConductor(id: number) {
    this.alertService.delete(
      'Eliminar Conductor',
      '¿Estás seguro de que deseas eliminar este conductor? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.conductorService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Conductor eliminado exitosamente');
            this.loadConductores();
          },
          error: (error) => {
            console.error('Error al eliminar conductor:', error);
            this.toastService.error('Error al eliminar conductor');
            this.loading.set(false);
          },
        });
      }
    );
  }
}
