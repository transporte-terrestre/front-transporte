import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbastecimientoService } from '@service/admin/abastecimiento.service';
import { ToastService } from '@service/toast.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { PATH, buildPath } from '@route/path.route';
import {
  AbastecimientoForm,
  AbastecimientoFormSubmitData,
} from '../../layout/abastecimiento-form/abastecimiento-form';

@Component({
  selector: 'app-abastecimientos-edit',
  imports: [CommonModule, AbastecimientoForm],
  templateUrl: './abastecimientos-edit.html',
})
export class AbastecimientosEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private abastecimientoService = inject(AbastecimientoService);
  private toastService = inject(ToastService);

  abastecimiento = signal<ApiResponse<'abastecimientos', 'findOne'> | null>(null);
  loading = signal(false);

  abastecimientoFormComponent = viewChild<AbastecimientoForm>(AbastecimientoForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAbastecimiento(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.abastecimientos)]);
    }
  }

  async loadAbastecimiento(id: number) {
    this.loading.set(true);
    try {
      const data = await this.abastecimientoService.findOne(id);
      this.abastecimiento.set(data);
    } catch (error) {
      console.error('Error al cargar abastecimiento:', error);
      this.toastService.error('Error al cargar abastecimiento');
      this.router.navigate([buildPath(PATH.admin.abastecimientos)]);
    } finally {
      this.loading.set(false);
    }
  }

  async handleFormSubmit(data: AbastecimientoFormSubmitData) {
    const current = this.abastecimiento();
    if (!current) return;

    this.loading.set(true);
    try {
      await this.abastecimientoService.update(current.id, data as ApiBody<'abastecimientos', 'update'>);
      this.toastService.success('Abastecimiento actualizado correctamente');
      this.router.navigate([buildPath(PATH.admin.abastecimientos)]);
    } catch (error) {
      console.error('Error al actualizar abastecimiento:', error);
      this.toastService.error('Error al actualizar abastecimiento');
    } finally {
      this.loading.set(false);
    }
  }

  handleValidationError(message: string) {
    this.toastService.warning(message);
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.abastecimientos)]);
  }
}
