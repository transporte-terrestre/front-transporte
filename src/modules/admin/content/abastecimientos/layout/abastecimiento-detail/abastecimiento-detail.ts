import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { AbastecimientoService } from '@service/admin/abastecimiento.service';
import { ApiResponse } from 'api/backend.api';

type Abastecimiento = ApiResponse<'abastecimientos', 'findOne'>;

@Component({
  selector: 'app-abastecimiento-detail',
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './abastecimiento-detail.html',
})
export class AbastecimientoDetail {
  private abastecimientoService = inject(AbastecimientoService);

  abastecimientoId = input<number>();

  abastecimiento = signal<Abastecimiento | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.abastecimientoId();
      if (id) this.loadAbastecimiento(id);
    });
  }

  async loadAbastecimiento(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.abastecimientoService.findOne(id);
      this.abastecimiento.set(data);
    } catch (error) {
      console.error('Error loading abastecimiento:', error);
      this.error.set('Error al cargar abastecimiento');
    } finally {
      this.loading.set(false);
    }
  }

  getVehiculoLabel() {
    const item = this.abastecimiento();
    if (!item) return '-';
    const codigo = item.vehiculoCodigoInterno ? `${item.vehiculoCodigoInterno} - ` : '';
    return `${codigo}${item.vehiculoPlaca || 'Sin placa'}`;
  }

  getVehiculoImage() {
    return this.abastecimiento()?.vehiculoImagenes?.[0] || null;
  }
}
