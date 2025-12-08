import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  DashboardStats,
  VehiculosPorEstado,
  ViajesRecientes,
  MantenimientosProximos,
  RutasPopulares,
  IngresosMensuales,
} from '@interface/admin/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(API_URL.dashboard.stats);
  }

  getVehiculosPorEstado(): Observable<VehiculosPorEstado> {
    return this.http.get<VehiculosPorEstado>(API_URL.dashboard.vehiculosEstado);
  }

  getViajesRecientes(): Observable<ViajesRecientes> {
    return this.http.get<ViajesRecientes>(API_URL.dashboard.viajesRecientes);
  }

  getMantenimientosProximos(): Observable<MantenimientosProximos> {
    return this.http.get<MantenimientosProximos>(API_URL.dashboard.mantenimientosProximos);
  }

  getRutasPopulares(): Observable<RutasPopulares> {
    return this.http.get<RutasPopulares>(API_URL.dashboard.rutasPopulares);
  }

  getIngresosMensuales(): Observable<IngresosMensuales> {
    return this.http.get<IngresosMensuales>(API_URL.dashboard.ingresosMensuales);
  }
}
