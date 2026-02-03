import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '@service/admin/proveedor.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { ProveedorForm } from '../../layout/proveedor-form/proveedor-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-proveedores-edit',
  standalone: true,
  imports: [CommonModule, ProveedorForm],
  templateUrl: './proveedores-edit.html',
})
export class ProveedoresEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proveedorService = inject(ProveedorService);
  private toastService = inject(ToastService);

  proveedor = signal<ApiResponse<'proveedores', 'findOne'> | null>(null);
  loading = signal(false);

  proveedorFormComponent = viewChild<ProveedorForm>(ProveedorForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProveedor(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.proveedores.list)]);
    }
  }

  loadProveedor(id: number) {
    this.loading.set(true);
    this.proveedorService
      .findOne(id)
      .then((proveedor) => {
        this.proveedor.set(proveedor);
      })
      .catch((error) => {
        console.error('Error al cargar proveedor:', error);
        this.toastService.error(getErrorMessage(error, 'Error al cargar proveedor'));
        this.router.navigate([buildPath(PATH.admin.proveedores.list)]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  handleFormSubmit(data: ApiBody<'proveedores', 'create'> | ApiBody<'proveedores', 'update'>) {
    if (!this.proveedor()) return;

    this.loading.set(true);
    this.proveedorService
      .update(this.proveedor()!.id, data as ApiBody<'proveedores', 'update'>)
      .then(() => {
        this.toastService.success('Proveedor actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.proveedores.list)]);
      })
      .catch((error) => {
        console.error('Error al actualizar proveedor:', error);
        this.toastService.error(getErrorMessage(error, 'Error al actualizar proveedor'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.proveedores.list)]);
  }
}
