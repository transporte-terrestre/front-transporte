import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaService } from '@service/admin/ruta.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { RutaForm } from '../../layout/ruta-form/ruta-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-rutas-edit',
  imports: [CommonModule, RutaForm],
  templateUrl: './rutas-edit.html',
  styleUrl: './rutas-edit.css',
})
export class RutasEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);

  ruta = signal<ApiResponse<'rutas', 'findOne'> | null>(null);
  loading = signal(false);

  rutaFormComponent = viewChild<RutaForm>(RutaForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRuta(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.rutas.list)]);
    }
  }

  loadRuta(id: number) {
    this.loading.set(true);
    this.rutaService
      .findOne(id)
      .then((ruta) => {
        this.ruta.set(ruta);
      })
      .catch((error) => {
        console.error('Error al cargar ruta:', error);
        this.toastService.error('Error al cargar ruta');
        this.router.navigate([buildPath(PATH.admin.rutas.list)]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  handleFormSubmit(data: ApiBody<'rutas', 'create'> | ApiBody<'rutas', 'update'>) {
    if (!this.ruta()) return;

    this.loading.set(true);
    this.rutaService
      .update(this.ruta()!.id, data as ApiBody<'rutas', 'update'>)
      .then(() => {
        this.toastService.success('Ruta actualizada exitosamente');
        this.router.navigate([buildPath(PATH.admin.rutas.list)]);
      })
      .catch((error) => {
        console.error('Error al actualizar ruta:', error);
        this.toastService.error(getErrorMessage(error, 'Error al actualizar ruta'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.rutas.list)]);
  }
}
