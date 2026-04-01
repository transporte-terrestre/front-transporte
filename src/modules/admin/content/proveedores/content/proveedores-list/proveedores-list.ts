import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProveedorService } from '@service/admin/proveedor.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import {
  ProveedorForm,
  ProveedorFormSubmitData,
  PendingProveedorDocument,
} from '../../layout/proveedor-form/proveedor-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalForm, ProveedorForm, PaginationComponent],
  templateUrl: './proveedores-list.html',
  styleUrl: './proveedores-list.css',
})
export class ProveedoresList implements OnInit, OnDestroy {
  private proveedorService = inject(ProveedorService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();

  proveedores = signal<ApiResponse<'proveedores', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'proveedores', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  proveedorFormComponent = viewChild<ProveedorForm>(ProveedorForm);

  ngOnInit() {
    this.loadProveedores();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadProveedores();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadProveedores() {
    this.loading.set(true);
    this.proveedorService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.proveedores.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar proveedores:', error);
        this.toastService.error('Error al cargar proveedores');
        this.loading.set(false);
      });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.currentPage.set(1);
    this.loadProveedores();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadProveedores();
  }

  onPageSizeChange() {
    this.currentPage.set(1);
    this.loadProveedores();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadProveedores();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(proveedor: ApiResponse<'proveedores', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.proveedores.edit).replace(':id', proveedor.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ProveedorFormSubmitData) {
    this.createProveedor(data);
  }

  handleModalSubmit() {
    this.proveedorFormComponent()?.submitForm();
  }

  async createProveedor(data: ProveedorFormSubmitData) {
    this.loading.set(true);
    try {
      const creationData = data as ApiBody<'proveedores', 'create'> & {
        documentos?: PendingProveedorDocument[];
      };
      const { documentos, ...proveedorData } = creationData;
      const newProveedor = await this.proveedorService.create(proveedorData);

      // Si hay documentos adjuntos, los creamos uno por uno
      if (documentos && documentos.length > 0) {
        for (const doc of documentos) {
          try {
            await this.proveedorService.createDocumento({
              proveedorId: newProveedor.id,
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

      this.toastService.success('Proveedor creado exitosamente');
      this.loadProveedores();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear proveedor'));
      this.loading.set(false);
    }
  }

  deleteProveedor(id: number) {
    this.alertService.delete(
      'Eliminar Proveedor',
      '¿Estás seguro de que deseas eliminar este proveedor?',
      () => {
        this.loading.set(true);
        this.proveedorService
          .delete(id)
          .then(() => {
            this.toastService.success('Proveedor eliminado exitosamente');
            this.loadProveedores();
          })
          .catch((error) => {
            console.error('Error al eliminar proveedor:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar proveedor'));
            this.loading.set(false);
          });
      },
    );
  }
}
