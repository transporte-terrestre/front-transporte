import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { VehiculoResultDto, VehiculoUpdateDto } from '@interface/admin/vehiculo.interface';
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

  vehiculo = signal<VehiculoResultDto | null>(null);
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

  loadVehiculo(id: number) {
    this.loading.set(true);
    this.vehiculoService.findOne(id).subscribe({
      next: (vehiculo) => {
        this.vehiculo.set(vehiculo);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar vehículo:', error);
        this.toastService.error('Error al cargar vehículo');
        this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.vehiculo()) return;

    this.loading.set(true);
    this.vehiculoService.update(this.vehiculo()!.id, data as VehiculoUpdateDto).subscribe({
      next: () => {
        this.toastService.success('Vehículo actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
      },
      error: (error) => {
        console.error('Error al actualizar vehículo:', error);
        this.toastService.error('Error al actualizar vehículo');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.vehiculos.list)]);
  }
}
