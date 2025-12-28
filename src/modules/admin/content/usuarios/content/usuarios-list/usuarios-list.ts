import { Component, signal, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuarioService } from '@service/admin/usuario.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { UsuarioForm } from '../../layout/usuario-form/usuario-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-usuarios-list',
  imports: [CommonModule, FormsModule, ModalForm, UsuarioForm, PaginationComponent],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit, OnDestroy {
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();

  usuarios = signal<ApiResponse<'usuarios', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'usuarios', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  usuarioFormComponent = viewChild<UsuarioForm>(UsuarioForm);

  ngOnInit() {
    this.loadUsuarios();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadUsuarios();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadUsuarios() {
    this.loading.set(true);
    this.usuarioService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.usuarios.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar usuarios:', error);
        this.toastService.error('Error al cargar usuarios');
        this.loading.set(false);
      });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.currentPage.set(1);
    this.loadUsuarios();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadUsuarios();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadUsuarios();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadUsuarios();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(usuario: ApiResponse<'usuarios', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.usuarios.edit).replace(':id', usuario.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: any) {
    this.createUsuario(data as ApiBody<'usuarios', 'create'>);
  }

  handleModalSubmit() {
    this.usuarioFormComponent()?.submitForm();
  }

  createUsuario(data: ApiBody<'usuarios', 'create'>) {
    this.loading.set(true);
    this.usuarioService
      .create(data)
      .then(() => {
        this.toastService.success('Usuario creado exitosamente');
        this.loadUsuarios();
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al crear usuario:', error);
        this.toastService.error('Error al crear usuario');
        this.loading.set(false);
      });
  }

  deleteUsuario(id: number) {
    this.alertService.delete(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.usuarioService
          .delete(id)
          .then(() => {
            this.toastService.success('Usuario eliminado exitosamente');
            this.loadUsuarios();
          })
          .catch((error) => {
            console.error('Error al eliminar usuario:', error);
            this.toastService.error('Error al eliminar usuario');
            this.loading.set(false);
          });
      }
    );
  }
}
