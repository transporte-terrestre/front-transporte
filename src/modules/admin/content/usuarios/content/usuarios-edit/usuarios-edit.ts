import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '@service/admin/usuario.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { UsuarioForm } from '../../layout/usuario-form/usuario-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-usuarios-edit',
  imports: [CommonModule, UsuarioForm],
  templateUrl: './usuarios-edit.html',
  styleUrl: './usuarios-edit.css',
})
export class UsuariosEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  usuario = signal<ApiResponse<'usuarios', 'findOne'> | null>(null);
  loading = signal(false);

  usuarioFormComponent = viewChild<UsuarioForm>(UsuarioForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUsuario(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.usuarios.list)]);
    }
  }

  loadUsuario(id: number) {
    this.loading.set(true);
    this.usuarioService
      .findOne(id)
      .then((usuario) => {
        this.usuario.set(usuario);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar usuario:', error);
        this.toastService.error('Error al cargar usuario');
        this.router.navigate([buildPath(PATH.admin.usuarios.list)]);
      });
  }

  handleFormSubmit(data: any) {
    if (!this.usuario()) return;

    this.loading.set(true);
    this.usuarioService
      .update(this.usuario()!.id, data as ApiBody<'usuarios', 'update'>)
      .then(() => {
        this.toastService.success('Usuario actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.usuarios.list)]);
      })
      .catch((error) => {
        console.error('Error al actualizar usuario:', error);
        this.toastService.error('Error al actualizar usuario');
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.usuarios.list)]);
  }
}
