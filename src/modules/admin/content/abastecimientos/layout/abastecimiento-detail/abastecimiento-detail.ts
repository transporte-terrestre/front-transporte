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

  getFechaLabel() {
    const item = this.abastecimiento();
    if (!item?.fechaAbastecimiento) return null;
    const parsed = new Date(item.fechaAbastecimiento);
    if (Number.isNaN(parsed.getTime())) return item.fechaAbastecimiento;

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .format(parsed)
      .replace(',', '');
  }

  getUbicacionLabel() {
    const item = this.abastecimiento();
    if (!item) return null;
    const lat = item.metadata?.ubicacion.lat ?? item.tramoLatitud;
    const lng = item.metadata?.ubicacion.lng ?? item.tramoLongitud;
    return lat != null && lng != null ? `${lat}, ${lng}` : null;
  }
}
