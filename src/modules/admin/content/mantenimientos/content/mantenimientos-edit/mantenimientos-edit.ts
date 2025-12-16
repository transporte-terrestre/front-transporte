import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import {
  MantenimientoResultDto,
  MantenimientoUpdateDto,
} from '@interface/admin/mantenimiento.interface';
import { ToastService } from '@service/toast.service';
import { MantenimientoForm } from '../../layout/mantenimiento-form/mantenimiento-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-mantenimientos-edit',
  imports: [CommonModule, MantenimientoForm],
  templateUrl: './mantenimientos-edit.html',
  styleUrl: './mantenimientos-edit.css',
})
export class MantenimientosEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);

  mantenimiento = signal<MantenimientoResultDto | null>(null);
  loading = signal(false);

  mantenimientoFormComponent = viewChild<MantenimientoForm>(MantenimientoForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMantenimiento(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
    }
  }

  loadMantenimiento(id: number) {
    this.loading.set(true);
    this.mantenimientoService.findOne(id).subscribe({
      next: (mantenimiento) => {
        this.mantenimiento.set(mantenimiento);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mantenimiento:', error);
        this.toastService.error('Error al cargar mantenimiento');
        this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.mantenimiento()) return;

    this.loading.set(true);
    this.mantenimientoService
      .update(this.mantenimiento()!.id, data as MantenimientoUpdateDto)
      .subscribe({
        next: () => {
          this.toastService.success('Mantenimiento actualizado exitosamente');
          this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
        },
        error: (error) => {
          console.error('Error al actualizar mantenimiento:', error);
          this.toastService.error('Error al actualizar mantenimiento');
          this.loading.set(false);
        },
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
  }
}
