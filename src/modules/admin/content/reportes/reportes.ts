import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '@service/admin/reportes.service';
import { ToastService } from '@service/toast.service';
import { ReporteQueryDto, ViajeDetalladoDto } from '@interface/admin/reportes.interface';
import { VehiculoInputSearch } from '../vehiculos/layout/vehiculo-input-search/vehiculo-input-search';
import { ConductorInputSearch } from '../conductores/layout/conductor-input-search/conductor-input-search';
import { ClienteInputSearch } from '../clientes/layout/cliente-input-search/cliente-input-search';
import { VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { ConductorListDto } from '@interface/admin/conductor.interface';
import { ClienteListDto } from '@interface/admin/cliente.interface';

type ReportMode = 'vehiculo' | 'conductor' | 'cliente';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VehiculoInputSearch,
    ConductorInputSearch,
    ClienteInputSearch,
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  private reportesService = inject(ReportesService);
  private toastService = inject(ToastService);

  // Report mode
  activeMode = signal<ReportMode>('vehiculo');

  // Date filters
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  // Entity Selection
  selectedVehiculoId = signal<number | null>(null);
  selectedConductorId = signal<number | null>(null);
  selectedClienteId = signal<number | null>(null);
  selectedEntityName = signal<string>('');

  // Selected entity data for proper display
  selectedVehiculo = signal<VehiculoResultDto | null>(null);
  selectedConductor = signal<ConductorListDto | null>(null);
  selectedCliente = signal<ClienteListDto | null>(null);

  // Results
  loading = signal(false);
  viajes = signal<ViajeDetalladoDto[]>([]);

  ngOnInit() {
    // Set default range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.fechaInicio.set(this.formatDate(firstDay));
    this.fechaFin.set(this.formatDate(today));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onModeChange(mode: ReportMode) {
    this.activeMode.set(mode);
    this.viajes.set([]); // Clear previous results
    this.selectedEntityName.set('');
  }

  onVehiculoSelected(id: number | null) {
    this.selectedVehiculoId.set(id);
  }

  onVehiculoEntitySelected(vehiculo: VehiculoResultDto | null) {
    this.selectedVehiculo.set(vehiculo);
    if (vehiculo) {
      this.selectedEntityName.set(`${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`);
    }
  }

  onConductorSelected(id: number | null) {
    this.selectedConductorId.set(id);
  }

  onConductorEntitySelected(conductor: ConductorListDto | null) {
    this.selectedConductor.set(conductor);
    if (conductor) {
      this.selectedEntityName.set(`${conductor.nombreCompleto} (Lic. ${conductor.numeroLicencia})`);
    }
  }

  onClienteSelected(id: number | null) {
    this.selectedClienteId.set(id);
  }

  onClienteEntitySelected(cliente: ClienteListDto | null) {
    this.selectedCliente.set(cliente);
    if (cliente) {
      const nombre = cliente.razonSocial || cliente.nombreCompleto;
      const documento = cliente.ruc || cliente.dni;
      const tipoDoc = cliente.ruc ? 'RUC' : 'DNI';
      this.selectedEntityName.set(`${nombre} (${tipoDoc}: ${documento})`);
    }
  }

  generarReporte() {
    const params: ReporteQueryDto = {
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
      this.reportesService.getViajesDetalladosPorVehiculo(id, params).subscribe({
        next: (data) => {
          this.viajes.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte');
          this.loading.set(false);
        },
      });
    } else if (mode === 'conductor') {
      const id = this.selectedConductorId();
      if (!id) {
        this.toastService.warning('Selecciona un conductor');
        this.loading.set(false);
        return;
      }
      this.reportesService.getViajesDetalladosPorConductor(id, params).subscribe({
        next: (data) => {
          this.viajes.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte');
          this.loading.set(false);
        },
      });
    } else if (mode === 'cliente') {
      const id = this.selectedClienteId();
      if (!id) {
        this.toastService.warning('Selecciona un cliente');
        this.loading.set(false);
        return;
      }
      this.reportesService.getViajesDetalladosPorCliente(id, params).subscribe({
        next: (data) => {
          this.viajes.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error', err);
          this.toastService.error('Error al cargar reporte');
          this.loading.set(false);
        },
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

  getRutaDisplay(viaje: ViajeDetalladoDto): string {
    if (viaje.tipoRuta === 'fija' && viaje.rutaOrigen && viaje.rutaDestino) {
      return `${viaje.rutaOrigen} → ${viaje.rutaDestino}`;
    }
    return viaje.rutaOcasional || 'Sin ruta definida';
  }

  getTotalKilometros(): number {
    return this.viajes().reduce((total, viaje) => {
      const distancia = viaje.distancia ? parseFloat(viaje.distancia) : 0;
      return total + distancia;
    }, 0);
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
      totalKilometros: this.getTotalKilometros(),
    });

    this.toastService.success('PDF generado exitosamente');
  }
}
