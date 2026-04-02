import { Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '@service/admin/reportes.service';
import { ToastService } from '@service/toast.service';
import { ApiResponse } from 'api/backend.api';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { TallerInputSearch } from '../../../../components/input-searchs/taller-input-search/taller-input-search';

export type MantenimientoReportMode = 'mantenimientos-vehiculo' | 'mantenimientos-taller';

@Component({
  selector: 'app-reportes-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, VehiculoInputSearch, TallerInputSearch],
  templateUrl: './reportes-mantenimiento.html',
  styleUrl: './reportes-mantenimiento.css',
})
export class ReportesMantenimiento implements OnInit {
  private reportesService = inject(ReportesService);
  private toastService = inject(ToastService);

  // Input from parent
  activeMode = input.required<MantenimientoReportMode>();

  // Date filters
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  // Entity Selection
  selectedVehiculoId = signal<number | null>(null);
  selectedTallerId = signal<number | null>(null);
  selectedEntityName = signal<string>('');

  // Selected entity data
  selectedVehiculo = signal<ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(null);
  selectedTaller = signal<ApiResponse<'talleres', 'findAll'>['data'][number] | null>(null);

  // Results
  loading = signal(false);
  mantenimientosVehiculos = signal<
    ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'>
  >([]);
  mantenimientosTaller = signal<ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>>(
    [],
  );

  ngOnInit() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fechaInicio.set(this.formatDate(firstDay));
    this.fechaFin.set(this.formatDate(today));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onVehiculoSelected(vehiculo: ApiResponse<'vehiculos', 'findAll'>['data'][number] | null) {
    this.selectedVehiculo.set(vehiculo);
    this.selectedVehiculoId.set(vehiculo?.id ?? null);
    if (vehiculo) {
      this.selectedEntityName.set(`${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`);
    } else {
      this.selectedEntityName.set('');
    }
  }

  onTallerSelected(taller: ApiResponse<'talleres', 'findAll'>['data'][number] | null) {
    this.selectedTaller.set(taller);
    this.selectedTallerId.set(taller?.id ?? null);
    if (taller) {
      this.selectedEntityName.set(taller.nombreComercial || taller.razonSocial);
    } else {
      this.selectedEntityName.set('');
    }
  }

  generarReporte() {
    const params = {
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
    };

    this.loading.set(true);
    this.mantenimientosVehiculos.set([]);
    this.mantenimientosTaller.set([]);

    const mode = this.activeMode();

    if (mode === 'mantenimientos-vehiculo') {
      const id = this.selectedVehiculoId() || 0;
      if (id === 0 && !this.selectedEntityName()) {
        this.selectedEntityName.set('Todos los Vehículos');
      }
      this.reportesService
        .getMantenimientosDetalladosPorVehiculo(id, { ...params, id })
        .then((data) => {
          this.mantenimientosVehiculos.set(data);
          this.loading.set(false);
        })
        .catch((err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte de mantenimientos');
          this.loading.set(false);
        });
    } else if (mode === 'mantenimientos-taller') {
      const id = this.selectedTallerId() || 0;
      if (id === 0 && !this.selectedEntityName()) {
        this.selectedEntityName.set('Todos los Talleres');
      }
      this.reportesService
        .getMantenimientosDetalladosPorTaller(id, { ...params, id })
        .then((data) => {
          this.mantenimientosTaller.set(data);
          this.loading.set(false);
        })
        .catch((err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte de talleres');
          this.loading.set(false);
        });
    }
  }

  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      pendiente: 'bg-warning/10 text-warning',
      en_progreso: 'bg-info/10 text-info',
      completado: 'bg-success/10 text-success',
      cancelado: 'bg-danger/10 text-danger',
    };
    return classes[estado] || 'bg-text/10 text-text';
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      pendiente: 'Pendiente',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    return labels[estado] || estado;
  }

  getTipoClass(tipo: string): string {
    const classes: { [key: string]: string } = {
      preventivo: 'bg-info/10 text-info',
      correctivo: 'bg-warning/10 text-warning',
    };
    return classes[tipo] || 'bg-text/10 text-text';
  }

  hasResults(): boolean {
    return this.mantenimientosVehiculos().length > 0 || this.mantenimientosTaller().length > 0;
  }

  getTotalCosto(): number {
    const mode = this.activeMode();
    if (mode === 'mantenimientos-vehiculo') {
      return this.mantenimientosVehiculos().reduce(
        (
          total: number,
          m: ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'>[number],
        ) => total + parseFloat(m.costoTotal || '0'),
        0,
      );
    } else {
      return this.mantenimientosTaller().reduce(
        (
          total: number,
          m: ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>[number],
        ) => total + parseFloat(m.costoTotal || '0'),
        0,
      );
    }
  }

  descargarPdf() {
    if (!this.hasResults()) {
      this.toastService.warning('No hay datos para generar el PDF');
      return;
    }

    this.reportesService.generateReporteMantenimientoPdf({
      tipoReporte: this.activeMode(),
      entidadNombre: this.selectedEntityName(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
      mantenimientosVehiculo:
        this.activeMode() === 'mantenimientos-vehiculo'
          ? this.mantenimientosVehiculos()
          : undefined,
      mantenimientosTaller:
        this.activeMode() === 'mantenimientos-taller' ? this.mantenimientosTaller() : undefined,
      totalCosto: this.getTotalCosto(),
    });

    this.toastService.success('PDF generado exitosamente');
  }
}
