import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '@service/admin/reportes.service';
import { ToastService } from '@service/toast.service';
import { ApiQuery, ResumenVehiculoDto } from 'api/backend.api';

@Component({
  selector: 'app-reportes-resumen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-resumen.html',
  styleUrl: './reportes-resumen.css',
})
export class ReportesResumen implements OnInit {
  private reportesService = inject(ReportesService);
  private toastService = inject(ToastService);

  // Date filters
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  fechaDia = signal<string>('');
  mesSeleccionado = signal<string>(this.getCurrentMonth());

  // Results
  loading = signal(false);
  resumen = signal<ResumenVehiculoDto[]>([]);


  ngOnInit() {
    this.setMonthRange(this.mesSeleccionado());
  }

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private setMonthRange(monthValue: string) {
    if (!monthValue) {
      this.fechaInicio.set('');
      this.fechaFin.set('');
      return;
    }
    const [year, month] = monthValue.split('-').map(Number);
    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    this.fechaInicio.set(firstDay);
    this.fechaFin.set(lastDayStr);
  }

  onMonthChange(value: string) {
    this.mesSeleccionado.set(value);
    this.setMonthRange(value);
    this.fechaDia.set('');
  }

  onDiaChange(value: string) {
    this.fechaDia.set(value);
    if (value) {
      this.fechaInicio.set(value);
      this.fechaFin.set(value);
    } else {
      this.setMonthRange(this.mesSeleccionado());
    }
  }

  generarReporte() {
    const params: ApiQuery<'reportes', 'getResumenVehiculos'> = {
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
    };

    this.loading.set(true);
    this.resumen.set([]);

    this.reportesService
      .getResumenVehiculos(params)
      .then((data) => {
        this.resumen.set(data);
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Error', err);
        this.toastService.error('Error al cargar reporte consolidado');
        this.loading.set(false);
      });
  }

  getTotalKilometraje(): number {
    return this.resumen().reduce((total, item) => total + (item.totalKilometraje || 0), 0);
  }

  getTotalGalones(): number {
    return this.resumen().reduce((total, item) => total + (item.totalGalones || 0), 0);
  }

  getTotalViajes(): number {
    return this.resumen().reduce((total, item) => total + (item.cantidadViajes || 0), 0);
  }

  descargarPdf() {
    if (this.resumen().length === 0) return;
    this.reportesService.generateReporteResumenFlotaPdf({
      mes: this.mesSeleccionado(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
      resumen: this.resumen(),
      totalKilometraje: this.getTotalKilometraje(),
      totalGalones: this.getTotalGalones(),
      totalViajes: this.getTotalViajes()
    });
  }

  async descargarExcel() {
    this.loading.set(true);

    try {
      const mantenimientos = await this.reportesService.getMantenimientosDetalladosPorVehiculo(0, {
        id: 0,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      });

      if (mantenimientos.length === 0) {
        this.toastService.warning('No hay mantenimientos para exportar en el periodo seleccionado');
        return;
      }

      this.reportesService.generateReporteMantenimientosExcel(mantenimientos, {
        titulo: 'HISTORIAL COMPLETO DE MANTENIMIENTOS — TODAS LAS UNIDADES',
        subtitulo:
          'Ordenado por Unidad y Fecha | Preventivos y Correctivos | Inversiones JR y Asociados S.A.C.',
        nombreArchivo: `Reporte_Flota_Mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      });
      this.toastService.success('Excel de mantenimientos generado exitosamente');
    } catch (error) {
      console.error('Error al exportar historial de mantenimientos:', error);
      this.toastService.error('Error al generar el Excel de mantenimientos');
    } finally {
      this.loading.set(false);
    }
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      circulacion: 'Circulación',
      taller: 'Taller',
      retirado: 'Retirado',
      alquilado: 'Alquilado'
    };
    return labels[estado] || estado;
  }
}
