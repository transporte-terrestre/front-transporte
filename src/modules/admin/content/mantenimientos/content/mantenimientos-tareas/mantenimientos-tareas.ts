import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { TareaResultDto, PaginationMeta } from '@interface/admin/mantenimiento.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { TareaForm } from './layout/tarea-form/tarea-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-mantenimientos-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ModalForm, TareaForm, PaginationComponent],
  templateUrl: './mantenimientos-tareas.html',
  styleUrl: './mantenimientos-tareas.css',
})
export class MantenimientosTareas implements OnInit, OnDestroy {
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  tareas = signal<TareaResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);

  // Edit mode
  editingTarea = signal<TareaResultDto | null>(null);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<PaginationMeta | null>(null);

  // Filters
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  tareaFormComponent = viewChild<TareaForm>(TareaForm);

  ngOnInit() {
    this.loadTareas();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadTareas();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadTareas() {
    this.loading.set(true);
    this.mantenimientoService
      .findAllTareas({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.tareas.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar tareas:', error);
          this.toastService.error('Error al cargar tareas');
          this.loading.set(false);
        },
      });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.currentPage.set(1);
    this.loadTareas();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadTareas();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadTareas();
  }

  navigateBack() {
    this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
  }

  openCreateModal() {
    this.editingTarea.set(null);
    this.showModal.set(true);
  }

  openEditModal(tarea: TareaResultDto) {
    this.editingTarea.set(tarea);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTarea.set(null);
  }

  handleModalSubmit() {
    this.tareaFormComponent()?.submit();
  }

  handleFormSubmit(data: { codigo: string; descripcion: string }) {
    this.loading.set(true);

    if (this.editingTarea()) {
      // Update
      this.mantenimientoService.updateTareaCatalogo(this.editingTarea()!.id, data).subscribe({
        next: () => {
          this.toastService.success('Tarea actualizada correctamente');
          this.loadTareas();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Error al actualizar la tarea');
          this.loading.set(false);
        },
      });
    } else {
      // Create
      this.mantenimientoService.createTareaCatalogo(data).subscribe({
        next: () => {
          this.toastService.success('Tarea creada correctamente');
          this.loadTareas();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Error al crear la tarea');
          this.loading.set(false);
        },
      });
    }
  }

  deleteTarea(tarea: TareaResultDto) {
    this.alertService.delete(
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar la tarea "${tarea.codigo}"?`,
      () => {
        this.loading.set(true);
        this.mantenimientoService.deleteTareaCatalogo(tarea.id).subscribe({
          next: () => {
            this.toastService.success('Tarea eliminada exitosamente');
            this.loadTareas();
          },
          error: (error) => {
            console.error('Error al eliminar tarea:', error);
            this.toastService.error('Error al eliminar tarea');
            this.loading.set(false);
          },
        });
      }
    );
  }
}
