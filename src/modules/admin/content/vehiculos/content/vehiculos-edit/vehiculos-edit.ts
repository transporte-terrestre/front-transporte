import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { VehiculoForm } from '../../layout/vehiculo-form/vehiculo-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-vehiculos-edit',
  imports: [CommonModule, VehiculoForm],
  templateUrl: './vehiculos-edit.html',
  styleUrl: './vehiculos-edit.css',
})
export class VehiculosEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  vehiculo = signal<ApiResponse<'vehiculos', 'findOne'> | null>(null);
  loading = signal(false);

  vehiculoFormComponent = viewChild<VehiculoForm>(VehiculoForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehiculo(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
    }
  }

  async loadVehiculo(id: number) {
    this.loading.set(true);
    try {
      const vehiculo = await this.vehiculoService.findOne(id);
      this.vehiculo.set(vehiculo);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar vehículo:', error);
      this.toastService.error('Error al cargar vehículo');
      this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
    }
  }

  async handleFormSubmit(data: ApiBody<'vehiculos', 'create'> | ApiBody<'vehiculos', 'update'>) {
    if (!this.vehiculo()) return;

    this.loading.set(true);
    try {
      await this.vehiculoService.update(
        this.vehiculo()!.id,
        data as ApiBody<'vehiculos', 'update'>
      );
      this.toastService.success('Vehículo actualizado exitosamente');
      this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      this.toastService.error('Error al actualizar vehículo');
      this.loading.set(false);
    }
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
  }
}
