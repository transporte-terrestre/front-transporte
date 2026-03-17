import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClienteService } from '@service/admin/cliente.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { ClienteForm, ClienteFormSubmitData, PendingClienteDocument } from '../../layout/cliente-form/cliente-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-clientes-list',
  imports: [CommonModule, FormsModule, ModalForm, ClienteForm, PaginationComponent],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.css',
})
export class ClientesList implements OnInit, OnDestroy {
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();

  clientes = signal<ApiResponse<'clientes', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'clientes', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  clienteFormComponent = viewChild<ClienteForm>(ClienteForm);

  ngOnInit() {
    this.loadClientes();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadClientes();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadClientes() {
    this.loading.set(true);
    this.clienteService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.clientes.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar clientes:', error);
        this.toastService.error('Error al cargar clientes');
        this.loading.set(false);
      });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.currentPage.set(1);
    this.loadClientes();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadClientes();
  }

  onPageSizeChange() {
    this.currentPage.set(1);
    this.loadClientes();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadClientes();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(cliente: ApiResponse<'clientes', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.clientes.edit).replace(':id', cliente.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ClienteFormSubmitData) {
    this.createCliente(data);
  }

  handleModalSubmit() {
    this.clienteFormComponent()?.submitForm();
  }

  async createCliente(data: ClienteFormSubmitData) {
    this.loading.set(true);
    try {
      const creationData = data as (ApiBody<'clientes', 'create'> & { documentos?: PendingClienteDocument[] });
      const { documentos, ...clienteData } = creationData;
      const newCliente = await this.clienteService.create(clienteData);

      // Si hay documentos adjuntos, los creamos uno por uno
      if (documentos && documentos.length > 0) {
        for (const doc of documentos) {
          try {
            await this.clienteService.createDocumento({
              clienteId: newCliente.id,
              tipo: doc.tipo as any,
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

      this.toastService.success('Cliente creado exitosamente');
      this.loadClientes();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear cliente'));
      this.loading.set(false);
    }
  }

  deleteCliente(id: number) {
    this.alertService.delete(
      'Eliminar Cliente',
      '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.clienteService
          .delete(id)
          .then(() => {
            this.toastService.success('Cliente eliminado exitosamente');
            this.loadClientes();
          })
          .catch((error) => {
            console.error('Error al eliminar cliente:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar cliente'));
            this.loading.set(false);
          });
      }
    );
  }
}
