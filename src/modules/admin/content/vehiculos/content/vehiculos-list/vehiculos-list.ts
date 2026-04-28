import { Component, signal, inject, OnInit, OnDestroy, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import {
  VehiculoForm,
  VehiculoFormSubmitData,
  PendingDocument,
} from '../../layout/vehiculo-form/vehiculo-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

import { ModalInfo } from '../../../../components/modal-info/modal-info';
import { VehiculoDetail } from '../../layout/vehiculo-detail/vehiculo-detail';
import { VehiculoComentarioAdd } from './layout/vehiculo-comentario-add/vehiculo-comentario-add';
import { VehiculoEstadoUpdate } from './layout/vehiculo-estado-update/vehiculo-estado-update';
import { MarcaInputSearch } from '../../../../components/input-searchs/marca-input-search/marca-input-search';
import { VehiculoUploadMany } from './layout/vehiculo-upload-many/vehiculo-upload-many';

@Component({
  selector: 'app-vehiculos-list',
  imports: [
    CommonModule,
    FormsModule,
    ModalForm,
    VehiculoForm,
    PaginationComponent,
    ModalInfo,
    VehiculoDetail,
    VehiculoComentarioAdd,
    VehiculoEstadoUpdate,
    MarcaInputSearch,
    VehiculoUploadMany,
  ],
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
  vehiculosEstadoDocumentos = signal<ApiResponse<'vehiculos', 'findAllEstadoDocumentos'>['data']>(
    [],
  );
  loading = signal(false);
  showModal = signal(false);
  filtroDocumentos = signal<'completo' | 'incompleto' | null>(null);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'vehiculos', 'findAll'>['meta'] | null>(null);

  // Detail
  // Detail
  selectedVehiculoId = signal<number | null>(null);
  showDetailModal = signal(false);

  viewDetails(id: number) {
    this.selectedVehiculoId.set(id);
    this.showDetailModal.set(true);
  }

  closeDetails() {
    this.showDetailModal.set(false);
    this.selectedVehiculoId.set(null);
  }

  // Comentarios Rápidos
  showAddComentarioModal = signal(false);
  vehiculoIdParaComentario = signal<number | null>(null);

  openAddComentario(id: number, event: Event) {
    event.stopPropagation();
    this.vehiculoIdParaComentario.set(id);
    this.showAddComentarioModal.set(true);
  }

  closeAddComentario() {
    this.showAddComentarioModal.set(false);
    this.vehiculoIdParaComentario.set(null);
  }

  onComentarioAdded() {
    this.closeAddComentario();
    this.loadVehiculos();
  }

  onStatusUpdated() {
    this.loadVehiculos();
  }

  // Filtros
  searchTerm = signal('');
  estado = signal<ApiBody<'vehiculos', 'update'>['estado'] | ''>('');
  marcaId = signal<number | string>('');
  selectedMarcaForSearch = signal<ApiResponse<'vehiculos', 'findOneMarca'> | null>(null);

  vehiculoFormComponent = viewChild<VehiculoForm>(VehiculoForm);
  tableContainer = viewChild<ElementRef>('tableContainer');

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

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

  onMouseDown(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('td:first-child')) {
      return;
    }

    const container = this.tableContainer()?.nativeElement;
    if (!container) return;
    this.isDown = true;
    container.style.cursor = 'grabbing';
    container.querySelector('tbody')!.style.cursor = 'grabbing';
    this.startX = e.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
    const container = this.tableContainer()?.nativeElement;
    if (container) {
      container.style.cursor = 'auto';
      const tbody = container.querySelector('tbody');
      if (tbody) tbody.style.cursor = 'grab';
    }
  }

  onMouseUp() {
    this.isDown = false;
    const container = this.tableContainer()?.nativeElement;
    if (container) {
      container.style.cursor = 'auto';
      const tbody = container.querySelector('tbody');
      if (tbody) tbody.style.cursor = 'grab';
    }
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const container = this.tableContainer()?.nativeElement;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  async loadVehiculos() {
    this.loading.set(true);
    try {
      const filtroDoc = this.filtroDocumentos();

      if (filtroDoc) {
        const response = await this.vehiculoService.findAllEstadoDocumentos({
          page: this.currentPage(),
          limit: this.pageSize(),
          filtro: filtroDoc,
          estado: this.estado() || undefined,
          marcaId: this.selectedMarcaForSearch()?.id || undefined,
          placa: this.searchTerm() || undefined,
        });
        this.vehiculosEstadoDocumentos.set(response.data);
        this.vehiculos.set([]);
        this.meta.set(response.meta);
      } else {
        const response = await this.vehiculoService.findAll({
          page: this.currentPage(),
          limit: this.pageSize(),
          search: this.searchTerm() || undefined,
          estado: this.estado() || undefined,
          marcaId: this.marcaId() ? Number(this.marcaId()) : undefined,
        });
        this.vehiculos.set(response.data);
        this.vehiculosEstadoDocumentos.set([]);
        this.meta.set(response.meta);
      }

      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      this.toastService.error(getErrorMessage(error, 'Error al cargar vehículos'));
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

  onFilterChange() {
    this.onSearch();
  }

  onMarcaChange(marca: ApiResponse<'vehiculos', 'findOneMarca'> | null) {
    this.selectedMarcaForSearch.set(marca);
    this.marcaId.set(marca?.id || '');
    this.onFilterChange();
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
    this.estado.set('');
    this.marcaId.set('');
    this.selectedMarcaForSearch.set(null);
    this.currentPage.set(1);
    this.loadVehiculos();
  }

  navigateToLineas() {
    const path = buildPath(PATH.admin.vehiculos.lineas);
    this.router.navigate([path]);
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  toggleFiltroDocumentos() {
    const current = this.filtroDocumentos();
    if (current === null) {
      this.filtroDocumentos.set('incompleto');
    } else {
      this.filtroDocumentos.set(null);
    }
    this.currentPage.set(1);
    this.loadVehiculos();
  }

  toggleCompletoIncompleto() {
    const current = this.filtroDocumentos();
    if (current === 'incompleto') {
      this.filtroDocumentos.set('completo');
    } else {
      this.filtroDocumentos.set('incompleto');
    }
    this.currentPage.set(1);
    this.loadVehiculos();
  }

  getFiltroLabel(): string {
    const filtro = this.filtroDocumentos();
    if (filtro === 'incompleto') return 'Incompletos';
    if (filtro === 'completo') return 'Completos';
    return 'Todos';
  }

  getFiltroIcon(): string {
    const filtro = this.filtroDocumentos();
    if (filtro === 'incompleto') return 'fa-exclamation-triangle';
    if (filtro === 'completo') return 'fa-check-circle';
    return 'fa-file-alt';
  }

  getDocumentoEstadoClass(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'text-success';
      case 'caducado':
        return 'text-warning';
      case 'nulo':
        return 'text-danger';
      case 'no_aplica':
        return 'text-text/40';
      default:
        return 'text-text/30';
    }
  }

  getDocumentoEstadoIcon(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'fa-check-circle';
      case 'caducado':
        return 'fa-clock';
      case 'nulo':
        return 'fa-times-circle';
      case 'no_aplica':
        return 'fa-minus-circle';
      default:
        return 'fa-question-circle';
    }
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

  handleFormSubmit(data: VehiculoFormSubmitData) {
    this.createVehiculo(data);
  }

  async createVehiculo(data: VehiculoFormSubmitData) {
    this.loading.set(true);
    try {
      const creationData = data as ApiBody<'vehiculos', 'create'> & {
        documentos?: PendingDocument[];
      };
      const { documentos, ...vehiculoData } = creationData;
      const newVehiculo = await this.vehiculoService.create(vehiculoData);

      // Si hay documentos adjuntos, los creamos uno por uno
      if (documentos && documentos.length > 0) {
        for (const doc of documentos) {
          try {
            await this.vehiculoService.createDocumento({
              vehiculoId: newVehiculo.id,
              tipo: doc.tipo,
              nombre: doc.data.nombre,
              url: doc.data.url,
              fechaEmision: doc.data.fechaEmision,
              fechaExpiracion: doc.data.fechaExpiracion,
            });
          } catch (error) {
            console.error('Error al crear documento adjunto:', error);
          }
        }
      }

      this.toastService.success('Vehículo creado exitosamente');
      this.loadVehiculos();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear vehículo'));
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
            this.toastService.error(getErrorMessage(error, 'Error al eliminar vehículo'));
            this.loading.set(false);
          },
        );
      },
    );
  }

  async updateVehiculoEstado(id: number, event: Event) {
    event.stopPropagation();
    const select = event.target as HTMLSelectElement;
    const estado = select.value as ApiBody<'vehiculos', 'update'>['estado'];

    this.loading.set(true);
    try {
      await this.vehiculoService.update(id, { estado });
      this.toastService.success('Estado actualizado correctamente');
      this.loadVehiculos();
    } catch (error) {
      console.error('Error al actualizar estado del vehículo:', error);
      this.toastService.error(getErrorMessage(error, 'Error al actualizar el estado del vehículo'));
      this.loadVehiculos();
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'disponible':
        return 'bg-success/10 text-success';
      case 'circulacion':
        return 'bg-info/10 text-info';
      case 'taller':
        return 'bg-warning/10 text-warning';
      case 'retirado':
        return 'bg-danger/10 text-danger';
      case 'alquilado':
        return 'bg-primary/40 text-text';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'disponible':
        return 'fa-check-circle';
      case 'circulacion':
        return 'fa-road';
      case 'taller':
        return 'fa-wrench';
      case 'retirado':
        return 'fa-times-circle';
      case 'alquilado':
        return 'fa-key';
      default:
        return 'fa-circle';
    }
  }
}
