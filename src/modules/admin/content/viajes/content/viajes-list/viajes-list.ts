import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViajeService } from '@service/admin/viaje.service';
import { RutaService } from '@service/admin/ruta.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ConductorService } from '@service/admin/conductor.service';
import { ClienteService } from '@service/admin/cliente.service';
import {
  ViajeListDto,
  ViajeCreateDto,
  ViajeEstado,
  PaginationMeta,
} from '@interface/admin/viaje.interface';
import { RutaResultDto } from '@interface/admin/ruta.interface';
import { VehiculoListDto } from '@interface/admin/vehiculo.interface';
import { ConductorListDto } from '@interface/admin/conductor.interface';
import { ClienteListDto } from '@interface/admin/cliente.interface';
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
  private rutaService = inject(RutaService);
  private vehiculoService = inject(VehiculoService);
  private conductorService = inject(ConductorService);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  viajes = signal<ViajeListDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  viewMode = signal<'grid' | 'table'>('grid');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<PaginationMeta | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  // Catálogos para mostrar nombres en lugar de IDs
  rutas = signal<Map<number, RutaResultDto>>(new Map());
  vehiculos = signal<Map<number, VehiculoListDto>>(new Map());
  conductores = signal<Map<number, ConductorListDto>>(new Map());
  clientes = signal<Map<number, ClienteListDto>>(new Map());

  viajeFormComponent = viewChild<ViajeForm>(ViajeForm);

  ngOnInit() {
    this.loadCatalogos();
    this.loadViajes();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadCatalogos() {
    // Para los catálogos usamos parámetros para obtener todos sin paginación
    this.rutaService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const map = new Map<number, RutaResultDto>();
        response.data.forEach((r) => map.set(r.id, r));
        this.rutas.set(map);
      },
    });

    this.vehiculoService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const map = new Map<number, VehiculoListDto>();
        response.data.forEach((v) => map.set(v.id, v));
        this.vehiculos.set(map);
      },
    });

    this.conductorService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const map = new Map<number, ConductorListDto>();
        response.data.forEach((c) => map.set(c.id, c));
        this.conductores.set(map);
      },
    });

    this.clienteService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const map = new Map<number, ClienteListDto>();
        response.data.forEach((c) => map.set(c.id, c));
        this.clientes.set(map);
      },
    });
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
    if (viaje.rutaId) {
      const ruta = this.rutas().get(viaje.rutaId);
      return ruta ? `${ruta.origen} → ${ruta.destino}` : `Ruta #${viaje.rutaId}`;
    }
    return viaje.rutaOcasional || 'Ruta no especificada';
  }

  getVehiculoDisplay(viaje: ViajeListDto): string {
    // ViajeListDto no tiene vehiculos, así que no podemos mostrarlo en la lista
    // a menos que el backend lo envíe. Por ahora mostramos un placeholder o nada.
    return 'Ver detalle';
  }

  getConductorDisplay(viaje: ViajeListDto): string {
    // ViajeListDto no tiene conductores, así que no podemos mostrarlo en la lista
    // a menos que el backend lo envíe. Por ahora mostramos un placeholder o nada.
    return 'Ver detalle';
  }

  getClienteDisplay(viaje: ViajeListDto): string {
    if (!viaje.clienteId) return 'Sin cliente';
    const cliente = this.clientes().get(viaje.clienteId);
    return cliente
      ? cliente.razonSocial || `${cliente.nombres} ${cliente.apellidos}`
      : `Cliente #${viaje.clienteId}`;
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
}
