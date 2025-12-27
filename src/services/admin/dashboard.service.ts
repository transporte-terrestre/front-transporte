import { Injectable, inject } from '@angular/core';
import { Api } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private api = inject(Api);
  async getStats() {
    return await this.api.dashboard.getStats().then((response) => response.data);
  }
  async getVehiculosPorEstado() {
    return await this.api.dashboard.getVehiculosPorEstado().then((response) => response.data);
  }
  async getViajesRecientes() {
    return await this.api.dashboard.getViajesRecientes().then((response) => response.data);
  }
  async getMantenimientosProximos() {
    return await this.api.dashboard.getMantenimientosProximos().then((response) => response.data);
  }
  async getRutasPopulares() {
    return await this.api.dashboard.getRutasPopulares().then((response) => response.data);
  }
  async getIngresosMensuales() {
    return await this.api.dashboard.getIngresosMensuales().then((response) => response.data);
  }
}
