import { Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '@service/admin/reportes.service';
import { ToastService } from '@service/toast.service';
import { ApiResponse, ApiQuery } from 'api/backend.api';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { ConductorInputSearch } from '../../../../components/input-searchs/conductor-input-search/conductor-input-search';
import { ClienteInputSearch } from '../../../../components/input-searchs/cliente-input-search/cliente-input-search';

export type ViajeReportMode = 'vehiculo' | 'conductor' | 'cliente';

@Component({
  selector: 'app-reportes-viaje',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VehiculoInputSearch,
    ConductorInputSearch,
    ClienteInputSearch,
  ],
  templateUrl: './reportes-viaje.html',
  styleUrl: './reportes-viaje.css',
})
export class ReportesViaje implements OnInit {
  private reportesService = inject(ReportesService);
  private toastService = inject(ToastService);

  // Input from parent
  activeMode = input.required<ViajeReportMode>();

  // Date filters
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  // Entity Selection
  selectedVehiculoId = signal<number | null>(null);
  selectedConductorId = signal<number | null>(null);
  selectedClienteId = signal<number | null>(null);
  selectedEntityName = signal<string>('');

  // Selected entity data
  selectedVehiculo = signal<ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(null);
  selectedConductor = signal<ApiResponse<'conductores', 'findAll'>['data'][number] | null>(null);
  selectedCliente = signal<ApiResponse<'clientes', 'findAll'>['data'][number] | null>(null);

  // Results
  loading = signal(false);
  viajes = signal<ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>>([]);

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

  onConductorSelected(conductor: ApiResponse<'conductores', 'findAll'>['data'][number] | null) {
    this.selectedConductor.set(conductor);
    this.selectedConductorId.set(conductor?.id ?? null);
    if (conductor) {
      this.selectedEntityName.set(`${conductor.nombreCompleto} (Lic. ${conductor.numeroLicencia})`);
    } else {
      this.selectedEntityName.set('');
    }
  }

  onClienteSelected(cliente: ApiResponse<'clientes', 'findAll'>['data'][number] | null) {
    this.selectedCliente.set(cliente);
    this.selectedClienteId.set(cliente?.id ?? null);
    if (cliente) {
      const nombre = cliente.razonSocial || cliente.nombreCompleto;
      const documento = cliente.ruc || cliente.dni;
      const tipoDoc = cliente.ruc ? 'RUC' : 'DNI';
      this.selectedEntityName.set(`${nombre} (${tipoDoc}: ${documento})`);
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
    this.viajes.set([]);

    const mode = this.activeMode();

    if (mode === 'vehiculo') {
      const id = this.selectedVehiculoId();
      if (!id) {
        this.toastService.warning('Selecciona un vehículo');
        this.loading.set(false);
        return;
      }
      this.reportesService
        .getViajesDetalladosPorVehiculo(id, { ...params, id })
        .then((data) => {
          this.viajes.set(data);
          this.loading.set(false);
        })
        .catch((err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte');
          this.loading.set(false);
        });
    } else if (mode === 'conductor') {
      const id = this.selectedConductorId();
      if (!id) {
        this.toastService.warning('Selecciona un conductor');
        this.loading.set(false);
        return;
      }
      this.reportesService
        .getViajesDetalladosPorConductor(id, { ...params, id })
        .then((data) => {
          this.viajes.set(data);
          this.loading.set(false);
        })
        .catch((err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte');
          this.loading.set(false);
        });
    } else if (mode === 'cliente') {
      const id = this.selectedClienteId();
      if (!id) {
        this.toastService.warning('Selecciona un cliente');
        this.loading.set(false);
        return;
      }
      this.reportesService
        .getViajesDetalladosPorCliente(id, { ...params, id })
        .then((data) => {
          this.viajes.set(data);
          this.loading.set(false);
        })
        .catch((err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte');
          this.loading.set(false);
        });
    }
  }

  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      programado: 'bg-warning/10 text-warning',
      en_progreso: 'bg-info/10 text-info',
      completado: 'bg-success/10 text-success',
      cancelado: 'bg-danger/10 text-danger',
    };
    return classes[estado] || 'bg-text/10 text-text';
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      programado: 'Programado',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    return labels[estado] || estado;
  }

  getRutaDisplay(viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]): string {
    if (viaje.tipoRuta === 'fija' && viaje.rutaOrigen && viaje.rutaDestino) {
      return `${viaje.rutaOrigen} → ${viaje.rutaDestino}`;
    }
    return viaje.rutaOcasional || 'Sin ruta definida';
  }

  getTotalKilometrosFinales(): number {
    return this.viajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) => {
        const distancia = viaje.distanciaFinal ? parseFloat(viaje.distanciaFinal) : 0;
        return total + distancia;
      },
      0,
    );
  }

  getTotalKilometrosEstimados(): number {
    return this.viajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) => {
        const distancia = viaje.distanciaEstimada ? parseFloat(viaje.distanciaEstimada) : 0;
        return total + distancia;
      },
      0,
    );
  }

  getTotalDiferencia(): number {
    return this.viajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) =>
        total + viaje.diferencia,
      0,
    );
  }

  getTotalHorasTotales(): number {
    return this.viajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) =>
        total + (viaje.horasTotales || 0),
      0,
    );
  }

  getTotalHorasExcedidas(): number {
    return this.viajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) =>
        total + (viaje.horasExcedidas || 0),
      0,
    );
  }

  descargarPdf() {
    if (this.viajes().length === 0) {
      this.toastService.warning('No hay datos para generar el PDF');
      return;
    }

    this.reportesService.generateReportePdf({
      tipoReporte: this.activeMode(),
      entidadNombre: this.selectedEntityName(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
      viajes: this.viajes(),
      totalKilometrosFinales: this.getTotalKilometrosFinales(),
      totalKilometrosEstimados: this.getTotalKilometrosEstimados(),
      totalDiferencia: this.getTotalDiferencia(),
    });

    this.toastService.success('PDF generado exitosamente');
  }
}
