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
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

interface CalendarEvent {
  viaje: ApiResponse<'viajes', 'findAll'>['data'][number];
  top: number;
  height: number;
  dayIndex: number;
  startHour: number;
  endHour: number;
}

@Component({
  selector: 'app-viajes-list',
  imports: [CommonModule, FormsModule, ModalForm, ViajeForm, PaginationComponent],
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
  viewMode = signal<'table' | 'calendar'>('table');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'viajes', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  // Calendario
  currentWeekStart = signal(this.getWeekStart(new Date()));
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

    for (const viaje of this.viajes()) {
      const fechaSalida = this.parseIsoAsLocal(viaje.fechaSalida);
      const fechaLlegada = viaje.fechaLlegada
        ? this.parseIsoAsLocal(viaje.fechaLlegada)
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
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
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

  navigateToEdit(viaje: ApiResponse<'viajes', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.viajes.edit).replace(':id', viaje.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleModalSubmit() {
    this.viajeFormComponent()?.submitForm();
  }

  handleFormSubmit(data: ApiBody<'viajes', 'create'> | ApiBody<'viajes', 'update'> | any) {
    if (Array.isArray(data)) {
      this.createViajesBatch(data);
    } else {
      // Si tiene ID es update, sino create.
      // Pero el output original combinaba ambos.
      // Asumiremos que si viene del form create y no es array, es create.
      // Si estamos editando, data tendrá id? ApiBody create no tiene id.
      // La lógica original llamaba a createViaje que llamaba a this.viajeService.create (solo create).
      // ¿Dónde se maneja el update?
      // Ah, navigateToEdit va a otra pagina? No, openCreateModal usa el form en modal.
      // navigateToEdit usa router.navigate. Así que el modal SOLO CREA.
      // La edición se hace en otra pantalla (viajes-edit).
      // Por tanto, aquí solo manejamos CREATE via modal.
      this.createViaje(data);
    }
  }

  async createViajesBatch(data: ApiBody<'viajes', 'create'>[]) {
    this.loading.set(true);
    try {
      // Ejecutar promesas en paralelo o serie.
      await Promise.all(data.map((d) => this.viajeService.create(d)));
      this.toastService.success('Viajes creados exitosamente');
      this.closeModal();
      if (this.viewMode() === 'calendar') {
        this.loadViajesForCalendar();
      } else {
        this.loadViajes();
      }
    } catch (error) {
      console.error('Error al crear viajes:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear viajes'));
      this.loading.set(false);
    }
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

  getRutaDisplay(viaje: ApiResponse<'viajes', 'findAll'>['data'][number]): string {
    if (viaje.ruta) {
      return `${viaje.ruta.origen} → ${viaje.ruta.destino}`;
    }
    return viaje.rutaOcasional || 'Ruta no especificada';
  }

  getVehiculoDisplay(viaje: ApiResponse<'viajes', 'findAll'>['data'][number]): string {
    return viaje.vehiculoPrincipal
      ? `${viaje.vehiculoPrincipal.marca ?? ''} ${viaje.vehiculoPrincipal.modelo ?? ''} - ${
          viaje.vehiculoPrincipal.placa
        }`.trim() || viaje.vehiculoPrincipal.placa
      : 'Sin vehículo';
  }

  getConductorDisplay(viaje: ApiResponse<'viajes', 'findAll'>['data'][number]): string {
    return viaje.conductorPrincipal?.nombreCompleto || 'Sin conductor';
  }

  getClienteDisplay(viaje: ApiResponse<'viajes', 'findAll'>['data'][number]): string {
    return viaje.cliente?.razonSocial || viaje.cliente?.nombreCompleto || 'Sin cliente';
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

  getSentidoBadgeClass(sentido: 'ida' | 'vuelta' | undefined): string {
    return 'bg-text/5 text-text/60';
  }

  getSentidoLabel(sentido: 'ida' | 'vuelta' | undefined): string {
    return sentido === 'vuelta' ? 'Vuelta' : 'Ida';
  }

  getSentidoIcon(sentido: 'ida' | 'vuelta' | undefined): string {
    return sentido === 'vuelta' ? 'fa-arrow-left' : 'fa-arrow-right';
  }

  getTurnoBadgeClass(turno: 'dia' | 'noche' | undefined): string {
    return 'bg-text/5 text-text/60';
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
}
