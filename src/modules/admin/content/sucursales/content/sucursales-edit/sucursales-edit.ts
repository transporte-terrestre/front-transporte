import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SucursalService } from '@service/admin/sucursal.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { SucursalForm } from '../../layout/sucursal-form/sucursal-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-sucursales-edit',
  imports: [CommonModule, SucursalForm],
  templateUrl: './sucursales-edit.html',
  styleUrl: './sucursales-edit.css',
})
export class SucursalesEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sucursalService = inject(SucursalService);
  private toastService = inject(ToastService);

  sucursal = signal<ApiResponse<'talleres', 'findOneSucursal'> | null>(null);
  loading = signal(false);

  sucursalFormComponent = viewChild<SucursalForm>(SucursalForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSucursal(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.sucursales.list)]);
    }
  }

  loadSucursal(id: number) {
    this.loading.set(true);
    this.sucursalService
      .findOne(id)
      .then((sucursal) => {
        this.sucursal.set(sucursal);
      })
      .catch((error) => {
        console.error('Error al cargar sucursal:', error);
        this.toastService.error('Error al cargar información de la sucursal');
        this.router.navigate([buildPath(PATH.admin.sucursales.list)]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  handleFormSubmit(
    data: ApiBody<'talleres', 'createSucursal'> | ApiBody<'talleres', 'updateSucursal'>,
  ) {
    if (!this.sucursal()) return;

    this.loading.set(true);
    this.sucursalService
      .update(this.sucursal()!.id, data as ApiBody<'talleres', 'updateSucursal'>)
      .then(() => {
        this.toastService.success('Sucursal actualizada exitosamente');
        this.router.navigate([buildPath(PATH.admin.sucursales.list)]);
      })
      .catch((error) => {
        console.error('Error al actualizar sucursal:', error);
        this.toastService.error(getErrorMessage(error, 'Error al actualizar sucursal'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.sucursales.list)]);
  }

  onSubmitClick() {
    this.sucursalFormComponent()?.submitForm();
  }
}
