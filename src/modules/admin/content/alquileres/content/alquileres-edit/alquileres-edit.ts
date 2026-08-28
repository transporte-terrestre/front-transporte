import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlquilerForm } from '../../layout/alquiler-form/alquiler-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-alquileres-edit',
  standalone: true,
  imports: [CommonModule, AlquilerForm],
  templateUrl: './alquileres-edit.html',
  styleUrl: './alquileres-edit.css',
})
export class AlquileresEdit implements OnInit {
  private alquilerService = inject(AlquilerService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  alquilerId = signal<number | null>(null);
  alquilerData = signal<ApiResponse<'alquileres', 'findOne'> | null>(null);
  loading = signal(false);

  formComponent = viewChild<AlquilerForm>('formComponent');

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.alquilerId.set(Number(id));
        this.loadAlquiler();
      }
    });
  }

  async loadAlquiler() {
    const id = this.alquilerId();
    if (!id) return;

    this.loading.set(true);
    try {
      const response = await this.alquilerService.findOne(id);
      this.alquilerData.set(response);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar alquiler:', error);
      this.toastService.error(getErrorMessage(error, 'Error al cargar alquiler'));
      this.loading.set(false);
      this.navigateBack();
    }
  }

  handleFormSubmit(data: ApiBody<'alquileres', 'update'>) {
    this.updateAlquiler(data);
  }

  submitForm() {
    if (this.formComponent()) {
      this.formComponent()!.submitForm();
    }
  }

  async updateAlquiler(data: ApiBody<'alquileres', 'update'>) {
    const id = this.alquilerId();
    if (!id) return;

    this.loading.set(true);
    try {
      await this.alquilerService.update(id, data);
      this.toastService.success('Alquiler actualizado exitosamente');
      this.loading.set(false);
      this.navigateBack();
    } catch (error) {
      console.error('Error al actualizar alquiler:', error);
      this.toastService.error(getErrorMessage(error, 'Error al actualizar alquiler'));
      this.loading.set(false);
    }
  }

  navigateBack() {
    this.router.navigate([buildPath(PATH.admin.alquileres)]);
  }

  formatCurrency(
    value: string | number | null | undefined,
    moneda: 'PEN' | 'USD' | null | undefined,
  ): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }
}
