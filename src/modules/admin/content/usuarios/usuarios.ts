import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '@service/admin/usuario.service';
import { UsuarioResultDto, UsuarioCreateDto, UsuarioUpdateDto } from '@interface/admin/usuario.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { UsuarioForm } from './layout/usuario-form/usuario-form';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, ModalForm, UsuarioForm],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  usuarios = signal<UsuarioResultDto[]>([]);
  filteredUsuarios = signal<UsuarioResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedUsuario = signal<UsuarioResultDto | null>(null);
  searchTerm = '';

  usuarioFormComponent = viewChild<UsuarioForm>(UsuarioForm);

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading.set(true);
    this.usuarioService.findAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.filteredUsuarios.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.toastService.error('Error al cargar usuarios');
        this.loading.set(false);
      },
    });
  }

  filterUsuarios() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsuarios.set(this.usuarios());
      return;
    }

    const filtered = this.usuarios().filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.apellido.toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term)
    );
    this.filteredUsuarios.set(filtered);
  }

  openCreateModal() {
    this.editMode.set(false);
    this.selectedUsuario.set(null);
    this.showModal.set(true);
  }

  openEditModal(usuario: UsuarioResultDto) {
    this.editMode.set(true);
    this.selectedUsuario.set(usuario);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedUsuario.set(null);
  }

  handleFormSubmit(data: UsuarioCreateDto | UsuarioUpdateDto) {
    if (this.editMode()) {
      this.updateUsuario(this.selectedUsuario()!.id, data as UsuarioUpdateDto);
    } else {
      this.createUsuario(data as UsuarioCreateDto);
    }
  }

  handleModalSubmit() {
    this.usuarioFormComponent()?.submitForm();
  }

  createUsuario(data: UsuarioCreateDto) {
    this.loading.set(true);
    this.usuarioService.create(data).subscribe({
      next: () => {
        this.toastService.success('Usuario creado exitosamente');
        this.loadUsuarios();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.toastService.error('Error al crear usuario');
        this.loading.set(false);
      },
    });
  }

  updateUsuario(id: number, data: UsuarioUpdateDto) {
    this.loading.set(true);
    this.usuarioService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Usuario actualizado exitosamente');
        this.loadUsuarios();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.toastService.error('Error al actualizar usuario');
        this.loading.set(false);
      },
    });
  }

  deleteUsuario(id: number) {
    this.alertService.delete(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.usuarioService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Usuario eliminado exitosamente');
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.toastService.error('Error al eliminar usuario');
            this.loading.set(false);
          },
        });
      }
    );
  }
}
