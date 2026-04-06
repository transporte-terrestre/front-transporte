import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '@service/admin/reportes.service';
import { ToastService } from '@service/toast.service';
import { ApiResponse, ApiQuery } from 'api/backend.api';

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
  resumen = signal<ApiResponse<'reportes', 'getResumenVehiculos'>>([]);

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
}
