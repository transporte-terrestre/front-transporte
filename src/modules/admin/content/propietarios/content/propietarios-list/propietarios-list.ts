import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PropietarioService } from '@service/admin/propietario.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import {
  PropietarioForm,
  PropietarioFormSubmitData,
  PendingPropietarioDocument,
} from '../../layout/propietario-form/propietario-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-propietarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalForm, PropietarioForm, PaginationComponent],
  templateUrl: './propietarios-list.html',
  styleUrl: './propietarios-list.css',
})
export class PropietariosList implements OnInit, OnDestroy {
  private propietarioService = inject(PropietarioService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();

  propietarios = signal<ApiResponse<'propietarios', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'propietarios', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  propietarioFormComponent = viewChild<PropietarioForm>(PropietarioForm);

  ngOnInit() {
    this.loadPropietarios();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadPropietarios();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadPropietarios() {
    this.loading.set(true);
    this.propietarioService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.propietarios.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar propietarios:', error);
        this.toastService.error(getErrorMessage(error, 'Error al cargar propietarios'));
        this.loading.set(false);
      });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.currentPage.set(1);
    this.loadPropietarios();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadPropietarios();
  }

  onPageSizeChange() {
    this.currentPage.set(1);
    this.loadPropietarios();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadPropietarios();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(propietario: ApiResponse<'propietarios', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.propietarios.edit).replace(':id', propietario.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: PropietarioFormSubmitData) {
    this.createPropietario(data);
  }

  handleModalSubmit() {
    this.propietarioFormComponent()?.submitForm();
  }

  async createPropietario(data: PropietarioFormSubmitData) {
    this.loading.set(true);
    try {
      const creationData = data as ApiBody<'propietarios', 'create'> & {
        documentos?: PendingPropietarioDocument[];
      };
      const { documentos, ...propietarioData } = creationData;
      const newPropietario = await this.propietarioService.create(propietarioData);

      // Si hay documentos adjuntos, los creamos uno por uno
      if (documentos && documentos.length > 0) {
        for (const doc of documentos) {
          try {
            await this.propietarioService.createDocumento({
              propietarioId: newPropietario.id,
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

      this.toastService.success('Propietario creado exitosamente');
      this.loadPropietarios();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear propietario:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear propietario'));
      this.loading.set(false);
    }
  }

  deletePropietario(id: number) {
    this.alertService.delete(
      'Eliminar Propietario',
      '¿Estás seguro de que deseas eliminar este propietario? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.propietarioService
          .delete(id)
          .then(() => {
            this.toastService.success('Propietario eliminado exitosamente');
            this.loadPropietarios();
          })
          .catch((error) => {
            console.error('Error al eliminar propietario:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar propietario'));
            this.loading.set(false);
          });
      },
    );
  }
}
