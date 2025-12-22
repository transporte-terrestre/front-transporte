import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViajeService } from '@service/admin/viaje.service';
import {
  ViajeListDto,
  ViajeCreateDto,
  ViajeEstado,
  PaginationMeta,
} from '@interface/admin/viaje.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { ViajeForm } from '../../layout/viaje-form/viaje-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-viajes-list',
  imports: [CommonModule, FormsModule, ModalForm, ViajeForm, PaginationComponent],
  templateUrl: './viajes-list.html',
  styleUrl: './viajes-list.css',
})
export class ViajesList implements OnInit, OnDestroy {
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  viajes = signal<ViajeListDto[]>([]);
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

  // Catálogos para mostrar nombres en lugar de IDs
  // vehiculos = signal<Map<number, VehiculoListDto>>(new Map());
  // conductores = signal<Map<number, ConductorListDto>>(new Map());

  viajeFormComponent = viewChild<ViajeForm>(ViajeForm);

  ngOnInit() {
    this.loadViajes();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadViajes() {
    this.loading.set(true);
    this.viajeService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.viajes.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar viajes:', error);
          this.toastService.error('Error al cargar viajes');
          this.loading.set(false);
        },
      });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadViajes();
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
    this.loadViajes();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadViajes();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadViajes();
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(viaje: ViajeListDto) {
    const path = buildPath(PATH.admin.viajes.edit).replace(':id', viaje.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: any) {
    this.createViaje(data as ViajeCreateDto);
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

  getRutaDisplay(viaje: ViajeListDto): string {
    if (viaje.ruta) {
      return `${viaje.ruta.origen} → ${viaje.ruta.destino}`;
    }
    return viaje.rutaOcasional || 'Ruta no especificada';
  }

  getVehiculoDisplay(viaje: ViajeListDto): string {
    return viaje.vehiculoPrincipal
      ? `${viaje.vehiculoPrincipal.marca ?? ''} ${viaje.vehiculoPrincipal.modelo ?? ''} - ${
          viaje.vehiculoPrincipal.placa
        }`.trim() || viaje.vehiculoPrincipal.placa
      : 'Sin vehículo';
  }

  getConductorDisplay(viaje: ViajeListDto): string {
    return viaje.conductorPrincipal?.nombreCompleto || 'Sin conductor';
  }

  getClienteDisplay(viaje: ViajeListDto): string {
    return viaje.cliente?.razonSocial || viaje.cliente?.nombreCompleto || 'Sin cliente';
  }

  getEstadoBadgeClass(estado: ViajeEstado): string {
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

  getEstadoIcon(estado: ViajeEstado): string {
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

  getEstadoLabel(estado: ViajeEstado): string {
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

  getDistanciaEstimada(viaje: ViajeListDto): string {
    return viaje.distanciaEstimada ? `${viaje.distanciaEstimada} km` : '-';
  }

  getDistanciaFinal(viaje: ViajeListDto): string {
    return viaje.distanciaFinal ? `${viaje.distanciaFinal} km` : '-';
  }

  getDiferenciaDistancia(viaje: ViajeListDto): { value: string; class: string } {
    if (!viaje.distanciaEstimada || !viaje.distanciaFinal) {
      return { value: '-', class: 'text-text/40' };
    }
    const diff = parseFloat(viaje.distanciaFinal) - parseFloat(viaje.distanciaEstimada);
    if (diff > 0) {
      return { value: `+${diff.toFixed(2)} km`, class: 'text-warning' };
    } else if (diff < 0) {
      return { value: `${diff.toFixed(2)} km`, class: 'text-success' };
    }
    return { value: '0 km', class: 'text-text/60' };
  }
}
