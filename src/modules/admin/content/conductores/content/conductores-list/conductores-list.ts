import { Component, signal, inject, OnInit, OnDestroy, viewChild, ElementRef } from '@angular/core';
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
import { ConductorForm, ConductorFormSubmitData, PendingConductorDocument } from '../../layout/conductor-form/conductor-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';
import { ModalInfo } from '@module/admin/components/modal-info/modal-info';
import { ConductorDetail } from '../../layout/conductor-detail/conductor-detail';

@Component({
  selector: 'app-conductores-list',
  imports: [
    CommonModule,
    FormsModule,
    ModalForm,
    ConductorForm,
    PaginationComponent,
    ModalInfo,
    ConductorDetail,
  ],
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
  conductoresEstadoDocumentos = signal<ApiResponse<'conductores', 'findAllEstadoDocumentos'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);
  filtroDocumentos = signal<'completo' | 'incompleto' | null>(null);

  // Detail Modal
  showDetailModal = signal(false);
  selectedConductorId = signal<number | null>(null);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'conductores', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  conductorFormComponent = viewChild<ConductorForm>(ConductorForm);
  tableContainer = viewChild<ElementRef>('tableContainer');

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

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

  async loadConductores() {
    this.loading.set(true);
    try {
      const filtroDoc = this.filtroDocumentos();

      if (filtroDoc) {
        const response = await this.conductorService.findAllEstadoDocumentos({
          page: this.currentPage(),
          limit: this.pageSize(),
          filtro: filtroDoc,
        });
        this.conductoresEstadoDocumentos.set(response.data);
        this.conductores.set([]);
        this.meta.set(response.meta);
      } else {
        const response = await this.conductorService.findAll({
          page: this.currentPage(),
          limit: this.pageSize(),
          search: this.searchTerm() || undefined,
          fechaInicio: this.fechaInicio() || undefined,
          fechaFin: this.fechaFin() || undefined,
        });
        this.conductores.set(response.data);
        this.conductoresEstadoDocumentos.set([]);
        this.meta.set(response.meta);
      }

      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar conductores:', error);
      this.toastService.error(getErrorMessage(error, 'Error al cargar conductores'));
      this.loading.set(false);
    }
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

  toggleFiltroDocumentos() {
    const current = this.filtroDocumentos();
    if (current === null) {
      this.filtroDocumentos.set('incompleto');
    } else {
      this.filtroDocumentos.set(null);
    }
    this.currentPage.set(1);
    this.loadConductores();
  }

  toggleCompletoIncompleto() {
    const current = this.filtroDocumentos();
    if (current === 'incompleto') {
      this.filtroDocumentos.set('completo');
    } else {
      this.filtroDocumentos.set('incompleto');
    }
    this.currentPage.set(1);
    this.loadConductores();
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

  navigateToEdit(conductor: ApiResponse<'conductores', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.conductores.edit).replace(':id', conductor.id.toString());
    this.router.navigate([path]);
  }

  viewDetails(id: number) {
    this.selectedConductorId.set(id);
    this.showDetailModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ConductorFormSubmitData) {
    this.createConductor(data);
  }

  handleModalSubmit() {
    this.conductorFormComponent()?.submitForm();
  }

  async createConductor(data: ConductorFormSubmitData) {
    this.loading.set(true);
    try {
      const creationData = data as (ApiBody<'conductores', 'create'> & { documentos?: PendingConductorDocument[] });
      const { documentos, ...conductorData } = creationData;
      const newConductor = await this.conductorService.create(conductorData);

      // Si hay documentos adjuntos, los creamos uno por uno
      if (documentos && documentos.length > 0) {
        for (const doc of documentos) {
          try {
            await this.conductorService.createDocumento({
              conductorId: newConductor.id,
              tipo: doc.tipo as any, // Cast to any here as the endpoint expects a specific union
              nombre: doc.data.nombre,
              url: doc.data.url,
              fechaEmision: doc.data.fechaEmision,
              fechaExpiracion: doc.data.fechaExpiracion,
            });
          } catch (docError) {
            console.error(`Error al subir documento ${doc.tipo}:`, docError);
            this.toastService.error(`No se pudo subir el documento: ${doc.tipo}`);
          }
        }
      }

      this.toastService.success('Conductor creado exitosamente');
      this.loadConductores();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear conductor:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear conductor'));
      this.loading.set(false);
    }
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
            this.toastService.error(getErrorMessage(error, 'Error al eliminar conductor'));
            this.loading.set(false);
          });
      },
    );
  }
}
