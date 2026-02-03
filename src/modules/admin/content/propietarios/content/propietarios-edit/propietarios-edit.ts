import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropietarioService } from '@service/admin/propietario.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { PropietarioForm } from '../../layout/propietario-form/propietario-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-propietarios-edit',
  standalone: true,
  imports: [CommonModule, PropietarioForm],
  templateUrl: './propietarios-edit.html',
})
export class PropietariosEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propietarioService = inject(PropietarioService);
  private toastService = inject(ToastService);

  propietario = signal<ApiResponse<'propietarios', 'findOne'> | null>(null);
  loading = signal(false);

  propietarioFormComponent = viewChild<PropietarioForm>(PropietarioForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPropietario(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.propietarios.list)]);
    }
  }

  loadPropietario(id: number) {
    this.loading.set(true);
    this.propietarioService
      .findOne(id)
      .then((propietario) => {
        this.propietario.set(propietario);
      })
      .catch((error) => {
        console.error('Error al cargar propietario:', error);
        this.toastService.error(getErrorMessage(error, 'Error al cargar propietario'));
        this.router.navigate([buildPath(PATH.admin.propietarios.list)]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  handleFormSubmit(data: ApiBody<'propietarios', 'create'> | ApiBody<'propietarios', 'update'>) {
    if (!this.propietario()) return;

    this.loading.set(true);
    this.propietarioService
      .update(this.propietario()!.id, data as ApiBody<'propietarios', 'update'>)
      .then(() => {
        this.toastService.success('Propietario actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.propietarios.list)]);
      })
      .catch((error) => {
        console.error('Error al actualizar propietario:', error);
        this.toastService.error(getErrorMessage(error, 'Error al actualizar propietario'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.propietarios.list)]);
  }
}
