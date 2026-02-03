import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TallerService } from '@service/admin/taller.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { TallerForm } from '../../layout/taller-form/taller-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-talleres-edit',
  imports: [CommonModule, TallerForm],
  templateUrl: './talleres-edit.html',
  styleUrl: './talleres-edit.css',
})
export class TalleresEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tallerService = inject(TallerService);
  private toastService = inject(ToastService);

  taller = signal<ApiResponse<'talleres', 'findOne'> | null>(null);
  loading = signal(false);

  tallerFormComponent = viewChild<TallerForm>(TallerForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTaller(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.talleres.list)]);
    }
  }

  loadTaller(id: number) {
    this.loading.set(true);
    this.tallerService
      .findOne(id)
      .then((taller) => {
        this.taller.set(taller);
      })
      .catch((error) => {
        console.error('Error al cargar taller:', error);
        this.toastService.error('Error al cargar información del taller');
        this.router.navigate([buildPath(PATH.admin.talleres.list)]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  handleFormSubmit(data: ApiBody<'talleres', 'create'> | ApiBody<'talleres', 'update'>) {
    if (!this.taller()) return;

    this.loading.set(true);
    this.tallerService
      .update(this.taller()!.id, data as ApiBody<'talleres', 'update'>)
      .then(() => {
        this.toastService.success('Taller actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.talleres.list)]);
      })
      .catch((error) => {
        console.error('Error al actualizar taller:', error);
        this.toastService.error(getErrorMessage(error, 'Error al actualizar taller'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.talleres.list)]);
  }
}
