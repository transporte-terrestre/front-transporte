import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiParam } from 'api/backend.api';
import { generateReportePdf, ReportePdfData } from '../../templates/reporte-viajes.template';
import {
  generateReporteMantenimientoPdf,
  ReporteMantenimientoPdfData,
} from '../../templates/reporte-mantenimientos.template';

import * as XLSX from 'xlsx';
import { generateReporteConductoresExcel } from '../../templates/reporte-conductores.template';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private api = inject(Api);
  // ========== VIAJES DETALLADOS ==========
  async getViajesDetalladosPorVehiculo(
    id: ApiParam<'reportes', 'getViajesDetalladosPorVehiculo', 'id'>,
    query?: ApiQuery<'reportes', 'getViajesDetalladosPorVehiculo'>
  ) {
    return await this.api.reportes
      .getViajesDetalladosPorVehiculo({ id, ...query })
      .then((response) => response.data);
  }
  async getViajesDetalladosPorConductor(
    id: ApiParam<'reportes', 'getViajesDetalladosPorConductor', 'id'>,
    query?: ApiQuery<'reportes', 'getViajesDetalladosPorConductor'>
  ) {
    return await this.api.reportes
      .getViajesDetalladosPorConductor({ id, ...query })
      .then((response) => response.data);
  }
  async getViajesDetalladosPorCliente(
    id: ApiParam<'reportes', 'getViajesDetalladosPorCliente', 'id'>,
    query?: ApiQuery<'reportes', 'getViajesDetalladosPorCliente'>
  ) {
    return await this.api.reportes
      .getViajesDetalladosPorCliente({ id, ...query })
      .then((response) => response.data);
  }
  // ========== MANTENIMIENTOS DETALLADOS ==========
  async getMantenimientosDetalladosPorVehiculo(
    id: ApiParam<'reportes', 'getMantenimientosDetalladosPorVehiculo', 'id'>,
    query?: ApiQuery<'reportes', 'getMantenimientosDetalladosPorVehiculo'>
  ) {
    return await this.api.reportes
      .getMantenimientosDetalladosPorVehiculo({ id, ...query })
      .then((response) => response.data);
  }
  async getMantenimientosDetalladosPorTaller(
    id: ApiParam<'reportes', 'getMantenimientosDetalladosPorTaller', 'id'>,
    query?: ApiQuery<'reportes', 'getMantenimientosDetalladosPorTaller'>
  ) {
    return await this.api.reportes
      .getMantenimientosDetalladosPorTaller({ id, ...query })
      .then((response) => response.data);
  }
  // ========== PDF GENERATION ==========
  generateReportePdf(data: ReportePdfData): void {
    generateReportePdf(data);
  }
  generateReporteMantenimientoPdf(data: ReporteMantenimientoPdfData): void {
    generateReporteMantenimientoPdf(data);
  }

  // ========== EXCEL REPORTS ==========
  async downloadReporteConductoresExcel() {
    try {
      const response = await this.api.reportes.getReporteConductores({});
      const data = response.data || [];
      generateReporteConductoresExcel(data);
    } catch (error) {
      console.error('Error downloading excel:', error);
    }
  }
}
