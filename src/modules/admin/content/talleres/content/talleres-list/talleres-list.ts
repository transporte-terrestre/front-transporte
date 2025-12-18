import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TallerService } from '@service/admin/taller.service';
import {
  TallerResultDto,
  TallerCreateDto,
  PaginationMeta,
  TallerTipo,
} from '@interface/admin/taller.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { TallerForm } from '../../layout/taller-form/taller-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-talleres-list',
  imports: [CommonModule, FormsModule, ModalForm, TallerForm, PaginationComponent],
  templateUrl: './talleres-list.html',
  styleUrl: './talleres-list.css',
})
export class TalleresList implements OnInit, OnDestroy {
  private tallerService = inject(TallerService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  talleres = signal<TallerResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  viewMode = signal<'grid' | 'table'>('table');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<PaginationMeta | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');
  tipo = signal<TallerTipo | ''>('');

  tallerFormComponent = viewChild<TallerForm>(TallerForm);

  ngOnInit() {
    this.loadTalleres();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadTalleres() {
    this.loading.set(true);
    this.tallerService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
        tipo: this.tipo() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.talleres.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar talleres:', error);
          this.toastService.error('Error al cargar talleres');
          this.loading.set(false);
        },
      });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadTalleres();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.onSearch();
  }

  onTipoChange(value: string) {
    this.tipo.set(value as TallerTipo);
    this.onSearch();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadTalleres();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadTalleres();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.tipo.set('');
    this.currentPage.set(1);
    this.loadTalleres();
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(taller: TallerResultDto) {
    const path = buildPath(PATH.admin.talleres.edit).replace(':id', taller.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: any) {
    this.createTaller(data as TallerCreateDto);
  }

  handleModalSubmit() {
    this.tallerFormComponent()?.submitForm();
  }

  createTaller(data: TallerCreateDto) {
    this.loading.set(true);
    this.tallerService.create(data).subscribe({
      next: () => {
        this.toastService.success('Taller creado exitosamente');
        this.loadTalleres();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear taller:', error);
        this.toastService.error('Error al crear taller');
        this.loading.set(false);
      },
    });
  }

  deleteTaller(id: number) {
    this.alertService.delete(
      'Eliminar Taller',
      '¿Estás seguro de que deseas eliminar este taller? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.tallerService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Taller eliminado exitosamente');
            this.loadTalleres();
          },
          error: (error) => {
            console.error('Error al eliminar taller:', error);
            this.toastService.error('Error al eliminar taller');
            this.loading.set(false);
          },
        });
      }
    );
  }

  getTipoClasse(tipo: string): string {
    switch (tipo) {
      case 'interno':
        return 'bg-success/10 text-success';
      case 'externo':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'interno':
        return 'fa-building';
      case 'externo':
        return 'fa-globe';
      default:
        return 'fa-circle';
    }
  }
}
