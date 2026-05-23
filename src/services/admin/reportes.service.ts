import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiParam, ApiResponse } from 'api/backend.api';
import { generateReportePdf, ReportePdfData } from '../../templates/reporte-viajes.template';
import {
  generateReporteMantenimientoPdf,
  ReporteMantenimientoPdfData,
} from '../../templates/reporte-mantenimientos.template';

import * as XLSX from 'xlsx';
import { generateReporteConductoresExcel } from '../../templates/reporte-conductores.template';
import { generateReporteViajesExcel } from '../../templates/reporte-viajes-excel.template';
import { generateReporteMantenimientosExcel } from '../../templates/reporte-mantenimientos-excel.template';
import { generateReporteResumenFlotaPdf, ReporteResumenFlotaData } from '../../templates/reporte-resumen-flota.template';


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

  async getResumenVehiculos(query?: ApiQuery<'reportes', 'getResumenVehiculos'>) {
    return await this.api.reportes.getResumenVehiculos({ ...query })
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
  async generateReportePdf(data: ReportePdfData): Promise<void> {
    await generateReportePdf(data);
  }
  async generateReporteMantenimientoPdf(data: ReporteMantenimientoPdfData): Promise<void> {
    await generateReporteMantenimientoPdf(data);
  }
  async generateReporteResumenFlotaPdf(data: ReporteResumenFlotaData): Promise<void> {
    await generateReporteResumenFlotaPdf(data);
  }

  // ========== EXCEL REPORTS ==========
  generateReporteViajesExcel(data: ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>): void {
    generateReporteViajesExcel(data);
  }

  generateReporteMantenimientosExcel(data: ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'> | ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>): void {
    generateReporteMantenimientosExcel(data);
  }
  generateReporteResumenFlotaExcel(data: any[], fechaInicio: string, fechaFin: string): void {
    const headers = [
      'VEHICULO', 'MARCA', 'MODELO', 'KM ACTUAL', 'ESTADO', 'CLIENTE ACTUAL', 'VIAJES', 'RECORRIDO (KM)', 'FUEL (GAL)', 'RENDIMIENTO (KM/GAL)'
    ];
    const rows = data.map(item => [
      item.placa,
      item.marca,
      item.modelo,
      item.kilometrajeActual,
      item.estado,
      item.clienteActual || (item.estado === 'disponible' ? 'DISPONIBLE' : '-'),
      item.cantidadViajes,
      item.totalKilometraje,
      item.totalGalones,
      item.totalGalones > 0 ? (item.totalKilometraje / item.totalGalones).toFixed(2) : '-'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen Flota');
    XLSX.writeFile(wb, `VAT-016_RESUMEN_FLOTA_${fechaInicio}_${fechaFin}.xlsx`);
  }
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
