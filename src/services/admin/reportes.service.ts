import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ReporteQueryDto,
  ReporteViajesVehiculoDto,
  ReporteViajesConductorDto,
  ReporteKilometrajeVehiculoDto,
  ViajeDetalladoDto,
} from '@interface/admin/reportes.interface';
import { generateReportePdf, ReportePdfData } from '../../templates/reporte-viajes.template';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private http = inject(HttpClient);

  // Resumen estadístico
  getViajesPorVehiculo(params?: ReporteQueryDto): Observable<ReporteViajesVehiculoDto[]> {
    return this.http.get<ReporteViajesVehiculoDto[]>(API_URL.reportes.viajesVehiculo(params));
  }

  getViajesPorConductor(params?: ReporteQueryDto): Observable<ReporteViajesConductorDto[]> {
    return this.http.get<ReporteViajesConductorDto[]>(API_URL.reportes.viajesConductor(params));
  }

  getKilometrajePorVehiculo(params?: ReporteQueryDto): Observable<ReporteKilometrajeVehiculoDto[]> {
    return this.http.get<ReporteKilometrajeVehiculoDto[]>(
      API_URL.reportes.kilometrajeVehiculo(params)
    );
  }

  // Reportes detallados
  getViajesDetalladosPorVehiculo(
    id: number,
    params?: ReporteQueryDto
  ): Observable<ViajeDetalladoDto[]> {
    return this.http.get<ViajeDetalladoDto[]>(
      API_URL.reportes.viajesDetalladosVehiculo(id, params)
    );
  }

  getViajesDetalladosPorConductor(
    id: number,
    params?: ReporteQueryDto
  ): Observable<ViajeDetalladoDto[]> {
    return this.http.get<ViajeDetalladoDto[]>(
      API_URL.reportes.viajesDetalladosConductor(id, params)
    );
  }

  getViajesDetalladosPorCliente(
    id: number,
    params?: ReporteQueryDto
  ): Observable<ViajeDetalladoDto[]> {
    return this.http.get<ViajeDetalladoDto[]>(API_URL.reportes.viajesDetalladosCliente(id, params));
  }

  // PDF Generation
  generateReportePdf(data: ReportePdfData): void {
    generateReportePdf(data);
  }
}
