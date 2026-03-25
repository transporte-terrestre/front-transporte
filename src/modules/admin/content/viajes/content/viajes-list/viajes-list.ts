import { Component, signal, inject, OnInit, OnDestroy, viewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViajeService } from '@service/admin/viaje.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { ViajeForm } from '../../layout/viaje-form/viaje-form';
import { ModalInfo } from '@module/admin/components/modal-info/modal-info';
import { ViajeDetail } from '../../layout/viaje-detail/viaje-detail';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';
import { ClienteInputSearch } from '../../../../components/input-searchs/cliente-input-search/cliente-input-search';
import { ConductorInputSearch } from '../../../../components/input-searchs/conductor-input-search/conductor-input-search';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import * as XLSX from 'xlsx';

export type ViajeIndividual = NonNullable<ApiResponse<'viajes', 'findAll'>['data'][0]['ida']>;

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

interface CalendarEvent {
  viaje: ViajeIndividual;
  top: number;
  height: number;
  dayIndex: number;
  startHour: number;
  endHour: number;
}

@Component({
  selector: 'app-viajes-list',
  imports: [CommonModule, FormsModule, ModalForm, ViajeForm, PaginationComponent, ClienteInputSearch, ConductorInputSearch, VehiculoInputSearch, ModalInfo, ViajeDetail],
  templateUrl: './viajes-list.html',
  styleUrl: './viajes-list.css',
})
export class ViajesList implements OnInit, OnDestroy {
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  viajes = signal<ApiResponse<'viajes', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);
  showDetailModal = signal(false);
  selectedViaje = signal<ViajeIndividual | null>(null);
  viewMode = signal<'table' | 'calendar'>('table');
  showFilters = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'viajes', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');
  fechaDia = signal('');
  mesSeleccionado = signal(this.getCurrentMonth());
  estado = signal('');
  sentido = signal('');
  turno = signal('');
  clienteId = signal<number | string>('');
  selectedClienteForSearch = signal<ApiResponse<'clientes', 'findAll'>['data'][number] | null>(null);
  conductorId = signal<number | string>('');
  selectedConductorForSearch = signal<ApiResponse<'conductores', 'findAll'>['data'][number] | null>(null);
  vehiculoId = signal<number | string>('');
  selectedVehiculoForSearch = signal<ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(null);

  // Calendario
  currentWeekStart = signal(this.getWeekStart(new Date()));

  // removed placeholder viewChild
  calendarHours = Array.from({ length: 24 }, (_, i) => i); // 0:00 - 23:00 (24 horas)

  // Catálogos para mostrar nombres en lugar de IDs
  // vehiculos = signal<Map<number, VehiculoListDto>>(new Map());
  // conductores = signal<Map<number, ConductorListDto>>(new Map());

  viajeFormComponent = viewChild<ViajeForm>(ViajeForm);

  // Computed para los días de la semana
  weekDays = computed<WeekDay[]>(() => {
    const weekStart = this.currentWeekStart();
    const days: WeekDay[] = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);

      days.push({
        date: date,
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        isToday: dateOnly.getTime() === today.getTime(),
      });
    }
    return days;
  });

  // Computed para eventos del calendario
  calendarEvents = computed<CalendarEvent[]>(() => {
    const weekStart = this.currentWeekStart();
    const events: CalendarEvent[] = [];

    const allTrips = this.viajes().flatMap((c) => {
      const trips = [];
      if (c.ida) trips.push(c.ida);
      if (c.vuelta) trips.push(c.vuelta);
      if (c.circuito) trips.push(c.circuito);
      return trips;
    });

    for (const viaje of allTrips) {
      const fechaSalida = this.parseIsoAsLocal(
        viaje.fechaSalidaProgramada || viaje.fechaSalida || '',
      );
      const fechaLlegada =
        viaje.fechaLlegadaProgramada || viaje.fechaLlegada
          ? this.parseIsoAsLocal(viaje.fechaLlegadaProgramada || viaje.fechaLlegada || '')
          : new Date(fechaSalida.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

      // Normalizar fechas de inicio/fin para iterar por días
      const current = new Date(fechaSalida);
      current.setHours(0, 0, 0, 0);

      const endDay = new Date(fechaLlegada);
      endDay.setHours(0, 0, 0, 0);

      // Iterar mientras el día actual sea menor o igual al día de llegada
      while (current <= endDay) {
        // Calcular índice del día relativo a la semana actual
        // weekStart ya está normalizado a 00:00 por getWeekStart
        const diffTime = current.getTime() - weekStart.getTime();
        const dayIndex = Math.floor(diffTime / (24 * 60 * 60 * 1000));

        // Si ya pasamos el final de la semana, no necesitamos seguir iterando
        if (dayIndex > 6) break;

        // Si el día está dentro de la semana (0-6)
        if (dayIndex >= 0) {
          // Determinar hora inicio y fin para este fragmento del día
          let startHour = 0;
          let endHour = 24;

          // Si es el primer día del viaje (coincide con la fecha de salida), usar la hora de salida real
          if (current.getTime() === new Date(fechaSalida).setHours(0, 0, 0, 0)) {
            startHour = fechaSalida.getHours() + fechaSalida.getMinutes() / 60;
          }

          // Si es el último día del viaje (coincide con la fecha de llegada), usar la hora de llegada real
          if (current.getTime() === new Date(fechaLlegada).setHours(0, 0, 0, 0)) {
            endHour = fechaLlegada.getHours() + fechaLlegada.getMinutes() / 60;
          }

          // Calcular duración de este fragmento
          const duration = Math.max(0, endHour - startHour);

          // Solo mostrar si tiene duración significativa
          // O si es el día de inicio (permite eventos puntuales), pero evita mostrar "restos" de 0h en días siguientes (ej: termina a las 00:00)
          const isStartDay = current.getTime() === new Date(fechaSalida).setHours(0, 0, 0, 0);

          if (duration > 0 || (isStartDay && duration === 0)) {
            // Ajuste visual: min height 24px solo si es muy pequeño pero no nulo
            const hourHeight = 40 + 0.8;
            // Permitimos eventos cortos pero visibles
            const height = Math.max(24, duration * hourHeight);

            events.push({
              viaje,
              top: startHour * hourHeight,
              height: height,
              dayIndex,
              startHour,
              endHour,
            });
          }
        }

        // Avanzar al siguiente día
        current.setDate(current.getDate() + 1);
      }
    }

    return events;
  });

  // Helper para parsear ISO como Local ignorando la zona horaria (tratando la hora como "wall clock")
  private parseIsoAsLocal(dateString: string): Date {
    if (!dateString) return new Date();
    if (dateString.indexOf('T') > -1) {
      const [datePart, timePart] = dateString.split('T');
      const [y, m, d] = datePart.split('-').map(Number);
      const [h, min, s] = timePart.substring(0, 8).split(':').map(Number);
      return new Date(y, m - 1, d, h, min, s || 0);
    }
    return new Date(dateString);
  }

  // Obtener el primer día de la semana (Domingo)
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Navegar a la semana anterior
  previousWeek() {
    const current = this.currentWeekStart();
    const prev = new Date(current);
    prev.setDate(prev.getDate() - 7);
    this.currentWeekStart.set(prev);
    this.loadViajesForCalendar();
  }

  // Navegar a la semana siguiente
  nextWeek() {
    const current = this.currentWeekStart();
    const next = new Date(current);
    next.setDate(next.getDate() + 7);
    this.currentWeekStart.set(next);
    this.loadViajesForCalendar();
  }

  // Ir a hoy
  goToToday() {
    this.currentWeekStart.set(this.getWeekStart(new Date()));
    this.loadViajesForCalendar();
  }

  // Obtener el rango de fechas de la semana
  getWeekRange(): string {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${
        months[start.getMonth()]
      } ${start.getFullYear()}`;
    }
    return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${
      months[end.getMonth()]
    } ${start.getFullYear()}`;
  }

  // Obtener fecha para el input (primer día de la semana en formato YYYY-MM-DD)
  getSelectedDateForInput(): string {
    const date = this.currentWeekStart();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Cuando el usuario selecciona una fecha en el input
  onDateInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const [y, m, d] = input.value.split('-').map(Number);
      const selectedDate = new Date(y, m - 1, d);
      this.currentWeekStart.set(this.getWeekStart(selectedDate));
      this.loadViajesForCalendar();
    }
  }

  // Formatear hora
  formatHour(hour: number): string {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  }

  // Obtener eventos por día
  getEventsForDay(dayIndex: number): CalendarEvent[] {
    return this.calendarEvents().filter((e) => e.dayIndex === dayIndex);
  }

  // Obtener color del evento según estado
  getEventColor(estado: ApiResponse<'viajes', 'findOne'>['estado']): string {
    switch (estado) {
      case 'programado':
        return 'bg-info text-white';
      case 'en_progreso':
        return 'bg-warning text-white';
      case 'completado':
        return 'bg-success text-white';
      case 'cancelado':
        return 'bg-danger text-white';
      default:
        return 'bg-text/20 text-text';
    }
  }

  // Cargar viajes para el calendario (sin paginación)
  async loadViajesForCalendar() {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Formatear fechas como YYYY-MM-DD local
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    this.loading.set(true);
    try {
      const response = await this.viajeService.findAll({
        page: 1,
        limit: 100,
        fechaInicio: formatDate(start),
        fechaFin: formatDate(end),
      });
      this.viajes.set(response.data);
      this.meta.set(response.meta);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
      this.toastService.error('Error al cargar viajes');
      this.loading.set(false);
    }
  }

  // Formatear hora corta para eventos
  formatTimeShort(dateString: string): string {
    const date = this.parseIsoAsLocal(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  }

  ngOnInit() {
    // Setear rango del mes actual por defecto
    this.setMonthRange(this.mesSeleccionado());

    // Cargar según el modo de vista inicial
    if (this.viewMode() === 'calendar') {
      this.loadViajesForCalendar();
    } else {
      this.loadViajes();
    }

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  async loadViajes() {
    this.loading.set(true);
    try {
      const response = await this.viajeService.findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
        estado: (this.estado() as any) || undefined,
        sentido: (this.sentido() as any) || undefined,
        turno: (this.turno() as any) || undefined,
        clienteId: this.clienteId() ? Number(this.clienteId()) : undefined,
        conductoresId: this.conductorId() ? [String(this.conductorId())] : undefined,
        vehiculosId: this.vehiculoId() ? [String(this.vehiculoId())] : undefined,
      });
      this.viajes.set(response.data);
      this.meta.set(response.meta);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
      this.toastService.error('Error al cargar viajes');
      this.loading.set(false);
    }
  }

  processedRows = computed(() => {
    const rows: {
      circuito: ApiResponse<'viajes', 'findAll'>['data'][0];
      viaje: ViajeIndividual | null;
      tipo: 'ida' | 'vuelta' | 'circuito';
      isFirst: boolean;
      rowSpan: number;
    }[] = [];

    this.viajes().forEach((circuito) => {
      const subRows: {
        tipo: 'ida' | 'vuelta' | 'circuito';
        viaje: ViajeIndividual;
      }[] = [];
      if (circuito.ida) subRows.push({ tipo: 'ida', viaje: circuito.ida });
      if (circuito.vuelta) subRows.push({ tipo: 'vuelta', viaje: circuito.vuelta });
      if (circuito.circuito) subRows.push({ tipo: 'circuito', viaje: circuito.circuito });

      if (subRows.length === 0) {
        rows.push({
          circuito,
          viaje: null,
          tipo: 'ida', // default
          isFirst: true,
          rowSpan: 1,
        });
        return;
      }

      subRows.forEach((sub, index) => {
        rows.push({
          circuito,
          viaje: sub.viaje,
          tipo: sub.tipo,
          isFirst: index === 0,
          rowSpan: subRows.length,
        });
      });
    });

    return rows;
  });

  onSearch() {
    this.currentPage.set(1);
    this.loadViajes();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onDateChange() {
    this.onSearch();
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
    this.onSearch();
  }

  onDiaChange(value: string) {
    this.fechaDia.set(value);
    if (value) {
      this.fechaInicio.set(value);
      this.fechaFin.set(value);
    } else {
      this.setMonthRange(this.mesSeleccionado());
    }
    this.onSearch();
  }

  onFilterChange() {
    this.onSearch();
  }

  onClienteChange(cliente: ApiResponse<'clientes', 'findAll'>['data'][number] | null) {
    this.selectedClienteForSearch.set(cliente);
    this.clienteId.set(cliente?.id || '');
    this.onFilterChange();
  }

  onConductorChange(conductor: ApiResponse<'conductores', 'findAll'>['data'][number] | null) {
    this.selectedConductorForSearch.set(conductor);
    this.conductorId.set(conductor?.id || '');
    this.onFilterChange();
  }

  onVehiculoChange(vehiculo: ApiResponse<'vehiculos', 'findAll'>['data'][number] | null) {
    this.selectedVehiculoForSearch.set(vehiculo);
    this.vehiculoId.set(vehiculo?.id || '');
    this.onFilterChange();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadViajes();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadViajes();
  }

  clearFilters() {
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.fechaDia.set('');
    this.mesSeleccionado.set(this.getCurrentMonth());
    this.setMonthRange(this.mesSeleccionado());
    this.estado.set('');
    this.sentido.set('');
    this.turno.set('');
    this.clienteId.set('');
    this.selectedClienteForSearch.set(null);
    this.conductorId.set('');
    this.selectedConductorForSearch.set(null);
    this.vehiculoId.set('');
    this.selectedVehiculoForSearch.set(null);
    this.currentPage.set(1);
    this.loadViajes();
  }

  toggleViewMode() {
    const nextMode = this.viewMode() === 'calendar' ? 'table' : 'calendar';
    this.viewMode.set(nextMode);

    // Recargar datos según el modo
    if (nextMode === 'calendar') {
      this.loadViajesForCalendar();
    } else {
      this.loadViajes();
    }
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  // Detail modal
  viewDetails(viaje: ViajeIndividual) {
    this.selectedViaje.set(viaje);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
  }

  navigateToEdit(viaje: ViajeIndividual) {
    const path = buildPath(PATH.admin.viajes.edit).replace(':id', viaje.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleModalSubmit() {
    this.viajeFormComponent()?.submitForm();
  }

  handleFormSubmit(data: ApiBody<'viajes', 'create'> | ApiBody<'viajes', 'update'>) {
    this.createViaje(data);
  }

  async createViaje(data: ApiBody<'viajes', 'create'> | ApiBody<'viajes', 'update'>) {
    this.loading.set(true);
    try {
      await this.viajeService.create(data as ApiBody<'viajes', 'create'>);
      this.toastService.success('Viaje creado exitosamente');
      this.closeModal();
      if (this.viewMode() === 'calendar') {
        this.loadViajesForCalendar();
      } else {
        this.loadViajes();
      }
    } catch (error) {
      console.error('Error al crear viaje:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear viaje'));
      this.loading.set(false);
    }
  }

  deleteViaje(id: number) {
    this.alertService.delete(
      'Eliminar Viaje',
      '¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.viajeService.delete(id).then(
          () => {
            this.toastService.success('Viaje eliminado exitosamente');
            if (this.viewMode() === 'calendar') {
              this.loadViajesForCalendar();
            } else {
              this.loadViajes();
            }
          },
          (error) => {
            console.error('Error al eliminar viaje:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar viaje'));
            this.loading.set(false);
          },
        );
      },
    );
  }

  exportToExcel() {
    if (this.viajes().length === 0) {
      this.toastService.warning('No hay datos para exportar');
      return;
    }

    const data = this.processedRows().map((row) => {
      const v = row.viaje;
      if (!v) return null;

      return {
        ID: row.circuito.id,
        Sentido: this.getSentidoLabel(row.tipo),
        Cliente: this.getClienteDisplay(v),
        Ruta: this.getRutaDisplay(v),
        Vehículo: this.getVehiculoDisplay(v),
        Conductor: this.getConductorDisplay(v),
        Estado: this.getEstadoLabel(v.estado),
        Turno: this.getTurnoLabel(v.turno),
        Salida: this.formatDate(v.fechaSalidaProgramada || v.fechaSalida || ''),
        Llegada: v.fechaLlegadaProgramada || v.fechaLlegada ? this.formatDate(v.fechaLlegadaProgramada || v.fechaLlegada || '') : '-',
      };
    }).filter(r => r !== null);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Viajes');
    XLSX.writeFile(wb, `Reporte_Viajes_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  getRutaDisplay(viaje: ViajeIndividual): string {
    if (viaje.nombreRuta) return viaje.nombreRuta;
    if (viaje.ruta) {
      const { origen, destino } = viaje.ruta;
      return destino ? `${origen} → ${destino}` : origen;
    }
    return viaje.rutaOcasional || 'Ruta no especificada';
  }

  getVehiculoDisplay(viaje: ViajeIndividual): string {
    return viaje.vehiculoPrincipal
      ? `${viaje.vehiculoPrincipal.marca ?? ''} ${viaje.vehiculoPrincipal.modelo ?? ''} - ${
          viaje.vehiculoPrincipal.placa
        }`.trim() || viaje.vehiculoPrincipal.placa
      : 'Sin vehículo';
  }

  getConductorDisplay(viaje: ViajeIndividual): string {
    return viaje.conductorPrincipal?.nombreCompleto || 'Sin conductor';
  }

  getClienteDisplay(viaje: ViajeIndividual): string {
    const clienteName = viaje.cliente?.razonSocial || viaje.cliente?.nombreCompleto || 'Sin cliente';
    const entidadName = viaje.entidad?.nombreServicio;

    let display = clienteName;
    if (entidadName) display += ` (${entidadName})`;
    return display;
  }

  getEstadoBadgeClass(estado: ApiResponse<'viajes', 'findOne'>['estado']): string {
    switch (estado) {
      case 'programado':
        return 'bg-info/10 text-info';
      case 'en_progreso':
        return 'bg-warning/10 text-warning';
      case 'completado':
        return 'bg-success/10 text-success';
      case 'cancelado':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoIcon(estado: ApiResponse<'viajes', 'findOne'>['estado']): string {
    switch (estado) {
      case 'programado':
        return 'fa-clock';
      case 'en_progreso':
        return 'fa-truck';
      case 'completado':
        return 'fa-check-circle';
      case 'cancelado':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  }

  getEstadoLabel(estado: ApiResponse<'viajes', 'findOne'>['estado']): string {
    switch (estado) {
      case 'programado':
        return 'Programado';
      case 'en_progreso':
        return 'En Progreso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  getSentidoBadgeClass(sentido: 'ida' | 'vuelta' | 'circuito' | undefined): string {
    if (sentido === 'circuito') return 'bg-text/10 text-text uppercase';
    return sentido === 'vuelta'
      ? 'bg-info/10 text-info uppercase'
      : 'bg-success/10 text-success uppercase';
  }

  getSentidoLabel(sentido: 'ida' | 'vuelta' | 'circuito' | undefined): string {
    if (sentido === 'circuito') return 'Circuito';
    return sentido === 'vuelta' ? 'Vuelta' : 'Ida';
  }

  getSentidoIcon(sentido: 'ida' | 'vuelta' | 'circuito' | undefined): string {
    if (sentido === 'circuito') return 'fa-route';
    return sentido === 'vuelta' ? 'fa-arrow-left' : 'fa-arrow-right';
  }

  getTurnoBadgeClass(turno: 'dia' | 'noche' | undefined): string {
    return turno === 'noche'
      ? 'bg-text border-text text-background shadow-sm'
      : 'bg-text/5 border-text/10 text-text/80 shadow-sm';
  }

  getTurnoLabel(turno: 'dia' | 'noche' | undefined): string {
    return turno === 'noche' ? 'Noche' : 'Día';
  }

  getTurnoIcon(turno: 'dia' | 'noche' | undefined): string {
    return turno === 'noche' ? 'fa-moon' : 'fa-sun';
  }

  formatDate(dateString: string): string {
    const date = this.parseIsoAsLocal(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day} ${month} ${year} ${hours}:${strMinutes} ${ampm}`;
  }

  formatTimeOnly(dateString: string): string {
    const date = this.parseIsoAsLocal(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  }

  formatDateOnly(dateString: string): string {
    const date = this.parseIsoAsLocal(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const month = months[date.getMonth()];
    // The image format is '25 Feb' or just the abbreviated month so no year
    return `${day} ${month}`;
  }
}
