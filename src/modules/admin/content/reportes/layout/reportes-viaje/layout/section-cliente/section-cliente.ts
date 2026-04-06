import { Component, inject, signal, input, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '@service/admin/reportes.service';
import { ToastService } from '@service/toast.service';
import { ApiResponse, ApiQuery } from 'api/backend.api';
import { ClienteInputSearch } from '../../../../../../components/input-searchs/cliente-input-search/cliente-input-search';

export type ViajeReportMode = 'vehiculo' | 'conductor' | 'cliente';

// Definición de columnas disponibles
interface ColumnConfig {
  key: string;
  label: string;
  shortLabel: string;
  defaultVisible: boolean;
  align: 'left' | 'right' | 'center';
  minWidth: string;
  group: 'general' | 'distancia' | 'tiempo' | 'entidades';
}

const COLUMN_DEFINITIONS: ColumnConfig[] = [
  { key: 'circuitoId', label: 'ID Circuito', shortLabel: 'ID', defaultVisible: true, align: 'center', minWidth: '60px', group: 'general' },
  { key: 'sentido', label: 'Sentido', shortLabel: 'Sentido', defaultVisible: true, align: 'left', minWidth: '100px', group: 'general' },
  { key: 'ruta', label: 'Ruta', shortLabel: 'Ruta', defaultVisible: true, align: 'left', minWidth: '180px', group: 'general' },
  { key: 'modalidadServicio', label: 'Modalidad', shortLabel: 'Modalidad', defaultVisible: true, align: 'left', minWidth: '100px', group: 'general' },
  { key: 'estado', label: 'Estado', shortLabel: 'Estado', defaultVisible: true, align: 'left', minWidth: '100px', group: 'general' },
  { key: 'turno', label: 'Turno', shortLabel: 'Turno', defaultVisible: false, align: 'left', minWidth: '80px', group: 'general' },
  { key: 'numeroVale', label: 'Nro. Vale', shortLabel: 'Vale', defaultVisible: false, align: 'left', minWidth: '100px', group: 'general' },
  { key: 'distanciaEstimada', label: 'Km Estimados', shortLabel: 'Km Est.', defaultVisible: true, align: 'right', minWidth: '100px', group: 'distancia' },
  { key: 'distanciaFinal', label: 'Km Final', shortLabel: 'Km Final', defaultVisible: true, align: 'right', minWidth: '100px', group: 'distancia' },
  { key: 'diferencia', label: 'Diferencia Km', shortLabel: 'Dif.', defaultVisible: true, align: 'right', minWidth: '90px', group: 'distancia' },
  { key: 'fechaSalida', label: 'Fecha Salida', shortLabel: 'F. Salida', defaultVisible: true, align: 'left', minWidth: '140px', group: 'tiempo' },
  { key: 'fechaLlegada', label: 'Fecha Llegada', shortLabel: 'F. Llegada', defaultVisible: true, align: 'left', minWidth: '140px', group: 'tiempo' },
  { key: 'fechaSalidaProgramada', label: 'F. Salida Prog.', shortLabel: 'F.S. Prog.', defaultVisible: false, align: 'left', minWidth: '140px', group: 'tiempo' },
  { key: 'fechaLlegadaProgramada', label: 'F. Llegada Prog.', shortLabel: 'F.Ll. Prog.', defaultVisible: false, align: 'left', minWidth: '140px', group: 'tiempo' },
  { key: 'horasContrato', label: 'Horas Contrato', shortLabel: 'Hrs Ctr.', defaultVisible: true, align: 'right', minWidth: '100px', group: 'tiempo' },
  { key: 'horasTotales', label: 'Horas Totales', shortLabel: 'Hrs Tot.', defaultVisible: true, align: 'right', minWidth: '100px', group: 'tiempo' },
  { key: 'horasExcedidas', label: 'Horas Excedidas', shortLabel: 'Hrs Exc.', defaultVisible: true, align: 'right', minWidth: '100px', group: 'tiempo' },
  { key: 'vehiculo', label: 'Vehículo', shortLabel: 'Vehículo', defaultVisible: false, align: 'left', minWidth: '140px', group: 'entidades' },
  { key: 'conductor', label: 'Conductor', shortLabel: 'Conductor', defaultVisible: false, align: 'left', minWidth: '160px', group: 'entidades' },
  { key: 'cliente', label: 'Cliente', shortLabel: 'Cliente', defaultVisible: false, align: 'left', minWidth: '160px', group: 'entidades' },
  { key: 'entidad', label: 'Entidad/Servicio', shortLabel: 'Entidad', defaultVisible: false, align: 'left', minWidth: '140px', group: 'entidades' },
];

@Component({
  selector: 'app-section-cliente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClienteInputSearch,
  ],
  templateUrl: './section-cliente.html',
  styleUrl: './section-cliente.css',
})
export class SectionCliente implements OnInit {
  private reportesService = inject(ReportesService);
  private toastService = inject(ToastService);

  // Input from parent
  
  // Date filters
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  fechaDia = signal<string>('');
  mesSeleccionado = signal<string>(this.getCurrentMonth());

  // Additional filters
  filtroEstado = signal<string>('');
  filtroModalidad = signal<string>('');
  filtroSentido = signal<string>('');
  filtroTurno = signal<string>('');
  filtroTipoRuta = signal<string>('');
  showAdvancedFilters = signal<boolean>(true);

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

  // Column visibility
  columnDefinitions = signal<ColumnConfig[]>(COLUMN_DEFINITIONS);
  visibleColumns = signal<Set<string>>(new Set(COLUMN_DEFINITIONS.filter((c) => c.defaultVisible).map((c) => c.key)));
  showColumnSelector = signal(false);

  // Column groups for the selector UI
  columnGroups = computed(() => {
    const groups: { key: string; label: string; icon: string; columns: ColumnConfig[] }[] = [
      { key: 'general', label: 'General', icon: 'fa-info-circle', columns: [] },
      { key: 'distancia', label: 'Distancia', icon: 'fa-road', columns: [] },
      { key: 'tiempo', label: 'Tiempo', icon: 'fa-clock', columns: [] },
      { key: 'entidades', label: 'Entidades', icon: 'fa-users', columns: [] },
    ];
    const groupMap = new Map(groups.map((g) => [g.key, g]));
    this.columnDefinitions().forEach((col) => {
      groupMap.get(col.group)?.columns.push(col);
    });
    return groups;
  });

  ngOnInit() {
    this.setMonthRange(this.mesSeleccionado());

    // Auto-show relevant entity columns based on mode
    this.updateDefaultColumnsForMode();
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
    this.fechaDia.set(''); // Clear day selection if month changes
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

  private updateDefaultColumnsForMode() {
    const cols = new Set(this.visibleColumns());
    cols.add('vehiculo');
    cols.add('conductor');
    this.visibleColumns.set(cols);
  }

  isColumnVisible(key: string): boolean {
    return this.visibleColumns().has(key);
  }

  toggleColumn(key: string) {
    const cols = new Set(this.visibleColumns());
    if (cols.has(key)) {
      cols.delete(key);
    } else {
      cols.add(key);
    }
    this.visibleColumns.set(cols);
  }

  toggleColumnSelector() {
    this.showColumnSelector.update((v) => !v);
  }

  selectAllColumns() {
    this.visibleColumns.set(new Set(this.columnDefinitions().map((c) => c.key)));
  }

  deselectAllColumns() {
    // Mantener al menos las columnas mínimas
    this.visibleColumns.set(new Set(['circuitoId', 'sentido', 'ruta']));
  }

  visibleColumnsList = computed(() => {
    const visible = this.visibleColumns();
    return this.columnDefinitions().filter((c) => visible.has(c.key));
  });

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

    const id = this.selectedClienteId() || 0;

    if (id === 0 && !this.selectedEntityName()) {
      this.selectedEntityName.set('Todos los Clientes');
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

  // Filtered viajes based on extra filters
  filteredViajes = computed(() => {
    let result = this.viajes();
    const estado = this.filtroEstado();
    const modalidad = this.filtroModalidad();
    const sentido = this.filtroSentido();
    const turno = this.filtroTurno();
    const tipoRuta = this.filtroTipoRuta();

    if (estado) {
      result = result.filter((v) => v.estado === estado);
    }

    if (modalidad) {
      result = result.filter((v) => v.modalidadServicio === modalidad);
    }

    if (sentido) {
      result = result.filter((v) => v.sentido === sentido);
    }

    if (turno) {
      result = result.filter((v) => v.turno === turno);
    }

    if (tipoRuta) {
      result = result.filter((v) => v.tipoRuta === tipoRuta);
    }

    return result;
  });

  processedRows = computed(() => {
    const viajesList = this.filteredViajes();
    // Agrupar por circuitoId, manteniendo orden de inserción
    const groups = new Map<number, typeof viajesList>();

    viajesList.forEach((viaje) => {
      const cid = viaje.circuitoId || viaje.id; // si por alguna razón no tiene
      if (!groups.has(cid)) {
        groups.set(cid, []);
      }
      groups.get(cid)!.push(viaje);
    });

    const rows: {
      circuitoId: number;
      viaje: (typeof viajesList)[0];
      isFirst: boolean;
      rowSpan: number;
    }[] = [];

    groups.forEach((groupViajes, cid) => {
      groupViajes.forEach((viaje, index) => {
        rows.push({
          circuitoId: cid,
          viaje,
          isFirst: index === 0,
          rowSpan: groupViajes.length,
        });
      });
    });

    return rows;
  });

  // Unique estados and modalidades from results
  uniqueEstados = computed(() => {
    const set = new Set(this.viajes().map((v) => v.estado));
    return Array.from(set);
  });

  uniqueModalidades = computed(() => {
    const set = new Set(this.viajes().map((v) => v.modalidadServicio));
    return Array.from(set);
  });

  uniqueSentidos = computed(() => {
    const set = new Set(this.viajes().map((v) => v.sentido));
    return Array.from(set).filter(Boolean);
  });

  uniqueTurnos = computed(() => {
    const set = new Set(this.viajes().map((v) => v.turno));
    return Array.from(set).filter(Boolean);
  });

  uniqueTiposRuta = computed(() => {
    const set = new Set(this.viajes().map((v) => v.tipoRuta));
    return Array.from(set).filter(Boolean);
  });

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

  getSentidoBadgeClass(sentido: string | undefined): string {
    return sentido === 'vuelta'
      ? 'bg-info/10 text-info uppercase'
      : 'bg-success/10 text-success uppercase';
  }

  getSentidoLabel(sentido: string | undefined): string {
    return sentido === 'vuelta' ? 'Vuelta' : 'Ida';
  }

  getSentidoIcon(sentido: string | undefined): string {
    return sentido === 'vuelta' ? 'fa-arrow-left' : 'fa-arrow-right';
  }

  getTurnoLabel(turno: string | null | undefined): string {
    const labels: { [key: string]: string } = {
      dia: 'Día',
      noche: 'Noche',
    };
    return turno ? (labels[turno] || turno) : '—';
  }

  getTurnoIcon(turno: string | null | undefined): string {
    return turno === 'noche' ? 'fa-moon' : 'fa-sun';
  }

  getModalidadLabel(modalidad: string): string {
    const labels: { [key: string]: string } = {
      regular: 'Regular',
      expreso: 'Expreso',
      ejecutivo: 'Ejecutivo',
      especial: 'Especial',
      turismo: 'Turismo',
      corporativo: 'Corporativo',
    };
    return labels[modalidad] || modalidad;
  }

  getTipoRutaLabel(tipo: string): string {
    return tipo === 'fija' ? 'Ruta Fija' : tipo === 'ocasional' ? 'Ruta Ocasional' : tipo;
  }

  getRutaDisplay(viaje: any): string {
    if (viaje.nombreRuta) {
      return viaje.nombreRuta;
    }
    if (viaje.tipoRuta && (viaje.tipoRuta.toLowerCase() === 'fija' || viaje.tipoRuta.toLowerCase() === 'fijo') && viaje.rutaOrigen && viaje.rutaDestino) {
      return `${viaje.rutaOrigen} → ${viaje.rutaDestino}`;
    }
    return viaje.rutaOcasional || 'Sin ruta definida';
  }

  getTotalKilometrosFinales(): number {
    return this.filteredViajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) => {
        const distancia = viaje.distanciaFinal ? Math.round(parseFloat(viaje.distanciaFinal)) : 0;
        return total + distancia;
      },
      0,
    );
  }

  getTotalKilometrosEstimados(): number {
    return this.filteredViajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) => {
        const distancia = viaje.distanciaEstimada
          ? Math.round(parseFloat(viaje.distanciaEstimada))
          : 0;
        return total + distancia;
      },
      0,
    );
  }

  getTotalDiferencia(): number {
    return this.filteredViajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) =>
        total + Math.round(viaje.diferencia || 0),
      0,
    );
  }

  getTotalHorasTotales(): number {
    return this.filteredViajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) =>
        total + (viaje.horasTotales || 0),
      0,
    );
  }

  getTotalHorasExcedidas(): number {
    return this.filteredViajes().reduce(
      (total: number, viaje: ApiResponse<'reportes', 'getViajesDetalladosPorVehiculo'>[number]) =>
        total + (viaje.horasExcedidas || 0),
      0,
    );
  }

  descargarPdf() {
    if (this.filteredViajes().length === 0) {
      this.toastService.warning('No hay datos para generar el PDF');
      return;
    }

    this.reportesService.generateReportePdf({
      tipoReporte: 'cliente',
      entidadNombre: this.selectedEntityName(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
      viajes: this.filteredViajes(),
      totalKilometrosFinales: this.getTotalKilometrosFinales(),
      totalKilometrosEstimados: this.getTotalKilometrosEstimados(),
      totalDiferencia: this.getTotalDiferencia(),
    });

    this.toastService.success('PDF generado exitosamente');
  }

  formatDecimalHours(hours: number | string | null | undefined): string {
    if (hours === null || hours === undefined) return '—';
    const numericHours = typeof hours === 'string' ? parseFloat(hours) : hours;
    if (isNaN(numericHours) || numericHours === 0) return '0h 00m';

    const h = Math.floor(numericHours);
    const m = Math.round((numericHours - h) * 60);

    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }
}
