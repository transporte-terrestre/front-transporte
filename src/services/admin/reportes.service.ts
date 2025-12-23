import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ReporteQueryDto,
  ViajeDetalladoDto,
  MantenimientoDetalladoVehiculoDto,
  MantenimientoDetalladoTallerDto,
} from '@interface/admin/reportes.interface';
import { generateReportePdf, ReportePdfData } from '../../templates/reporte-viajes.template';
import {
  generateReporteMantenimientoPdf,
  ReporteMantenimientoPdfData,
} from '../../templates/reporte-mantenimientos.template';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private http = inject(HttpClient);

  // ========== VIAJES DETALLADOS ==========

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

  // ========== MANTENIMIENTOS DETALLADOS ==========

  getMantenimientosDetalladosPorVehiculo(
    id: number,
    params?: ReporteQueryDto
  ): Observable<MantenimientoDetalladoVehiculoDto[]> {
    return this.http.get<MantenimientoDetalladoVehiculoDto[]>(
      API_URL.reportes.mantenimientosDetalladosVehiculo(id, params)
    );
  }

  getMantenimientosDetalladosPorTaller(
    id: number,
    params?: ReporteQueryDto
  ): Observable<MantenimientoDetalladoTallerDto[]> {
    return this.http.get<MantenimientoDetalladoTallerDto[]>(
      API_URL.reportes.mantenimientosDetalladosTaller(id, params)
    );
  }

  // ========== PDF GENERATION ==========

  generateReportePdf(data: ReportePdfData): void {
    generateReportePdf(data);
  }

  generateReporteMantenimientoPdf(data: ReporteMantenimientoPdfData): void {
    generateReporteMantenimientoPdf(data);
  }
}
