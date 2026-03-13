import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoService } from '@service/admin/mantenimiento.service';

import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { MantenimientoForm } from '../../layout/mantenimiento-form/mantenimiento-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';
import { TallerInputSearch } from '../../../../components/input-searchs/taller-input-search/taller-input-search';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import * as XLSX from 'xlsx';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  mantenimientos: ApiResponse<'mantenimientos', 'findAll'>['data'];
}

@Component({
  selector: 'app-mantenimientos-list',
  imports: [
    CommonModule,
    FormsModule,
    ModalForm,
    MantenimientoForm,
    PaginationComponent,
    TallerInputSearch,
    VehiculoInputSearch,
  ],
  templateUrl: './mantenimientos-list.html',
  styleUrl: './mantenimientos-list.css',
})
export class MantenimientosList implements OnInit {
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mantenimientos = signal<ApiResponse<'mantenimientos', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);
  selectedDate = signal<Date | null>(null);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'mantenimientos', 'findAll'>['meta'] | null>(null);

  // Filtros
  showFilters = signal(false);
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');
  mesSeleccionado = signal(this.getCurrentMonth());
  tipo = signal('');
  estado = signal('');
  tallerId = signal<number | string>('');
  selectedTallerForSearch = signal<any>(null);
  vehiculoId = signal<number | string>('');
  selectedVehiculoForSearch = signal<any>(null);

  // Calendario
  currentDate = signal(new Date());
  calendarDays = signal<CalendarDay[]>([]);

  // Set default page size to 1000 for calendar view
  constructor() {
    this.pageSize.set(1000);
  }

  monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Día seleccionado para ver detalles
  selectedDay = signal<CalendarDay | null>(null);
  showDayDetails = signal(false);

  mantenimientoFormComponent = viewChild<MantenimientoForm>(MantenimientoForm);

  ngOnInit() {
    this.updateCalendarData();
  }

  loadMantenimientos() {
    this.loading.set(true);
    this.mantenimientoService
      .findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
        tipo: (this.tipo() as any) || undefined,
        estado: (this.estado() as any) || undefined,
        tallerId: this.tallerId() ? Number(this.tallerId()) : undefined,
        vehiculoId: this.vehiculoId() ? Number(this.vehiculoId()) : undefined,
      })
      .then((response) => {
        this.mantenimientos.set(response.data);
        this.meta.set(response.meta);
        this.generateCalendar();
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar mantenimientos:', error);
        this.toastService.error('Error al cargar mantenimientos');
        this.loading.set(false);
      });
  }

  onSearch() {
    this.currentPage.set(1);
    if (this.viewMode() === 'report') {
      this.loadEstadoMantenimientos();
    } else {
      this.loadMantenimientos();
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    if (this.viewMode() === 'report') {
      this.loadEstadoMantenimientos();
    } else {
      this.loadMantenimientos();
    }
  }

  onPageSizeChange(size?: number) {
    if (size) this.pageSize.set(size);
    this.currentPage.set(1);
    if (this.viewMode() === 'report') {
      this.loadEstadoMantenimientos();
    } else {
      this.loadMantenimientos();
    }
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.mesSeleccionado.set(this.getCurrentMonth());
    this.setMonthRange(this.mesSeleccionado());
    this.tipo.set('');
    this.estado.set('');
    this.tallerId.set('');
    this.selectedTallerForSearch.set(null);
    this.vehiculoId.set('');
    this.selectedVehiculoForSearch.set(null);
    this.currentPage.set(1);
    this.loadMantenimientos();
  }

  onMonthChange(value: string) {
    this.mesSeleccionado.set(value);
    this.setMonthRange(value);

    if (value) {
      const [year, month] = value.split('-').map(Number);
      this.currentDate.set(new Date(year, month - 1, 1));
    }

    this.onSearch();
  }

  onFilterChange() {
    if (this.viewMode() === 'report') {
      this.currentPage.set(1);
      this.loadEstadoMantenimientos();
    } else {
      this.onSearch();
    }
  }

  onTallerChange(taller: any) {
    this.selectedTallerForSearch.set(taller);
    this.tallerId.set(taller?.id || '');
    this.onFilterChange();
  }

  onVehiculoChange(vehiculo: any) {
    this.selectedVehiculoForSearch.set(vehiculo);
    this.vehiculoId.set(vehiculo?.id || '');
    this.onFilterChange();
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
    const lastDayStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(
      2,
      '0',
    )}`;
    this.fechaInicio.set(firstDay);
    this.fechaFin.set(lastDayStr);
  }

  generateCalendar() {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Días del mes anterior para completar la primera semana
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date,
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        mantenimientos: this.getMantenimientosByDate(date),
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.getTime() === today.getTime();
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday,
        mantenimientos: this.getMantenimientosByDate(date),
      });
    }

    // Días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false,
        mantenimientos: this.getMantenimientosByDate(date),
      });
    }

    this.calendarDays.set(days);
  }

  getMantenimientosByDate(date: Date): ApiResponse<'mantenimientos', 'findAll'>['data'] {
    const dateStr = this.formatDateToCompare(date);
    return this.mantenimientos().filter((m) => {
      // Crear fecha sin considerar zona horaria
      const fechaParts = m.fechaIngreso.split('T')[0].split('-');
      const mantDate = new Date(
        Number(fechaParts[0]),
        Number(fechaParts[1]) - 1,
        Number(fechaParts[2]),
      );
      const mantDateStr = this.formatDateToCompare(mantDate);
      return mantDateStr === dateStr;
    });
  }

  formatDateToCompare(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;
  }

  previousMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1));
    this.updateCalendarData();
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1));
    this.updateCalendarData();
  }

  goToToday() {
    this.currentDate.set(new Date());
    this.updateCalendarData();
  }

  updateCalendarData() {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    // Calcular el rango de fechas visible en el calendario (6 semanas = 42 días)
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 (Domingo) - 6 (Sábado)

    // Fecha de inicio del grid (si empieza domingo, es el 1, si no, días del mes anterior)
    const startDate = new Date(year, month, 1 - firstDayOfWeek);

    // Fecha fin del grid (start + 41 días)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 41);

    this.fechaInicio.set(this.formatDateToCompare(startDate));
    this.fechaFin.set(this.formatDateToCompare(endDate));

    // Asegurar que traemos todos los mantenimientos
    this.pageSize.set(1000);
    this.currentPage.set(1);

    this.loadMantenimientos();
  }

  onDayClick(day: CalendarDay) {
    if (day.mantenimientos.length > 0) {
      // Si hay mantenimientos, mostrar detalles
      this.selectedDay.set(day);
      this.showDayDetails.set(true);
    } else {
      // Si no hay mantenimientos, abrir modal para crear uno
      this.selectedDate.set(day.date);
      this.openCreateModal();
    }
  }

  closeDayDetails() {
    this.showDayDetails.set(false);
    this.selectedDay.set(null);
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  openCreateModalFromDay(date: Date) {
    this.selectedDate.set(date);
    this.closeDayDetails();
    this.openCreateModal();
  }

  navigateToEdit(mantenimiento: ApiResponse<'mantenimientos', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.mantenimientos.edit).replace(
      ':id',
      mantenimiento.id.toString(),
    );
    this.router.navigate([path]);
  }

  navigateToTareas() {
    this.router.navigate([buildPath(PATH.admin.mantenimientos.tareas)]);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedDate.set(null);
  }

  handleFormSubmit(data: any) {
    this.createMantenimiento(data as ApiBody<'mantenimientos', 'create'>);
  }

  handleModalSubmit() {
    this.mantenimientoFormComponent()?.submitForm();
  }

  createMantenimiento(data: ApiBody<'mantenimientos', 'create'>) {
    this.loading.set(true);
    this.mantenimientoService
      .create(data)
      .then(() => {
        this.toastService.success('Mantenimiento registrado exitosamente');
        this.loadMantenimientos();
        this.closeModal();
        this.closeDayDetails();
      })
      .catch((error) => {
        console.error('Error al crear mantenimiento:', error);
        this.toastService.error(getErrorMessage(error, 'Error al registrar mantenimiento'));
        this.loading.set(false);
      });
  }

  deleteMantenimiento(id: number) {
    this.alertService.delete(
      'Eliminar Mantenimiento',
      '¿Estás seguro de que deseas eliminar este registro de mantenimiento? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.mantenimientoService
          .delete(id)
          .then(() => {
            this.toastService.success('Mantenimiento eliminado exitosamente');
            this.loadMantenimientos();
            this.closeDayDetails();
          })
          .catch((error) => {
            console.error('Error al eliminar mantenimiento:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar mantenimiento'));
            this.loading.set(false);
          });
      },
    );
  }

  exportToExcel() {
    if (this.viewMode() === 'report') {
      this.exportReportToExcel();
      return;
    }

    if (this.mantenimientos().length === 0) {
      this.toastService.warning('No hay datos para exportar');
      return;
    }

    const data = this.mantenimientos().map((m) => {
      return {
        ID: m.id,
        Vehículo: this.getVehiculoDisplay(m.vehiculoId, m),
        Placa: this.getVehiculoPlaca(m.vehiculoId, m),
        Taller: this.getTallerDisplay(m.tallerId, m),
        Tipo: this.getTipoLabel(m.tipo),
        Fecha: this.formatDate(m.fechaIngreso),
        Costo: m.costoTotal ? Number(m.costoTotal) : 0,
        Estado: this.getEstadoLabel(m.estado),
        Descripción: m.descripcion,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mantenimientos');
    XLSX.writeFile(wb, `Reporte_Mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  private exportReportToExcel() {
    if (this.vehiculosEstadoMantenimiento().length === 0) {
      this.toastService.warning('No hay datos para exportar');
      return;
    }

    const data = this.vehiculosEstadoMantenimiento().map((item) => {
      return {
        Placa: item.placa,
        'Cód. Interno': item.codigoInterno || item.vehiculoId,
        'Último Mant. Fecha': item.ultimoMantenimientoFecha ? this.formatDate(item.ultimoMantenimientoFecha) : '-',
        'Último Mant. Km': item.ultimoMantenimientoKm || '-',
        'Próximo Mant. Km': item.proxMantenimientoKm || 'Sin Prog.',
        'Km Actual': item.kilometrajeActual,
        'Km Restante': item.kilometrajeRestante !== null ? `${item.kilometrajeRestante} km` : 'Sin Prog.',
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estado Flota');
    XLSX.writeFile(wb, `Reporte_Estado_Flota_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  getTallerDisplay(
    tallerId: number,
    mantenimiento?: ApiResponse<'mantenimientos', 'findAll'>['data'][number],
  ): string {
    if (mantenimiento && mantenimiento.taller) {
      return mantenimiento.taller.nombreComercial || mantenimiento.taller.razonSocial;
    }
    return `Taller #${tallerId}`;
  }

  getVehiculoDisplay(
    vehiculoId: number,
    mantenimiento?: ApiResponse<'mantenimientos', 'findAll'>['data'][number],
  ): string {
    if (mantenimiento && mantenimiento.vehiculo) {
      return `${mantenimiento.vehiculo.marca} ${mantenimiento.vehiculo.modelo}`;
    }
    return `Vehículo #${vehiculoId}`;
  }

  getVehiculoPlaca(
    vehiculoId: number,
    mantenimiento?: ApiResponse<'mantenimientos', 'findAll'>['data'][number],
  ): string {
    if (mantenimiento && mantenimiento.vehiculo) {
      return mantenimiento.vehiculo.placa;
    }
    return `#${vehiculoId}`;
  }

  getTipoBadgeClass(tipo: ApiField<'mantenimientos', 'findOne', 'tipo'>): string {
    switch (tipo) {
      case 'preventivo':
        return 'bg-info/10 text-info';
      case 'correctivo':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getTipoIcon(tipo: ApiField<'mantenimientos', 'findOne', 'tipo'>): string {
    switch (tipo) {
      case 'preventivo':
        return 'fa-shield-alt';
      case 'correctivo':
        return 'fa-wrench';
      default:
        return 'fa-tools';
    }
  }

  getTipoLabel(tipo: ApiField<'mantenimientos', 'findOne', 'tipo'>): string {
    switch (tipo) {
      case 'preventivo':
        return 'Preventivo';
      case 'correctivo':
        return 'Correctivo';
      default:
        return tipo;
    }
  }

  getEstadoBadgeClass(estado: ApiField<'mantenimientos', 'findOne', 'estado'>): string {
    switch (estado) {
      case 'pendiente':
        return 'bg-info/10 text-info';
      case 'en_proceso':
        return 'bg-warning/10 text-warning';
      case 'finalizado':
        return 'bg-success/10 text-success';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getEstadoLabel(estado: ApiField<'mantenimientos', 'findOne', 'estado'>): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'finalizado':
        return 'Finalizado';
      default:
        return estado;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatCurrency(value: string): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(Number(value));
  }

  formatKilometraje(value: number): string {
    return new Intl.NumberFormat('es-PE').format(value) + ' km';
  }

  // Reporte de Estado
  viewMode = signal<'calendar' | 'list' | 'report'>('calendar');
  vehiculosEstadoMantenimiento = signal<any[]>([]);
  sortOrder = signal<'proximos' | 'ultimos'>('proximos');

  toggleViewMode() {
    const current = this.viewMode();
    if (current === 'report') {
      this.viewMode.set('calendar');
      this.pageSize.set(1000); // All items for calendar
      this.currentPage.set(1);
      this.loadMantenimientos();
    } else {
      // If was calendar or list, go to report
      this.viewMode.set('report');
      this.pageSize.set(10);
      this.currentPage.set(1);
      this.sortOrder.set('proximos');
      this.loadEstadoMantenimientos();
    }
  }

  setSortOrder(order: 'proximos' | 'ultimos') {
    this.sortOrder.set(order);
    this.currentPage.set(1);
    this.loadEstadoMantenimientos();
  }

  toggleListCalendar() {
    if (this.viewMode() === 'calendar') {
      this.viewMode.set('list');
    } else if (this.viewMode() === 'list') {
      this.viewMode.set('calendar');
    }
  }

  loadEstadoMantenimientos() {
    this.loading.set(true);
    this.mantenimientoService
      .getReporteEstadoVehiculos({
        page: this.currentPage(),
        limit: this.pageSize(),
        sort: this.sortOrder(),
        vehiculoId: this.vehiculoId() ? Number(this.vehiculoId()) : undefined,
      })
      .then((response: any) => {
        this.vehiculosEstadoMantenimiento.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar estado de mantenimientos:', error);
        this.toastService.error('Error al cargar reporte de mantenimientos');
        this.loading.set(false);
      });
  }

  getRestanteClass(restante: number | null): string {
    if (restante === null) return 'bg-text/10 text-text/60'; // No data
    if (restante < 0) return 'bg-danger text-background font-bold'; // Overdue (Red)
    if (restante < 1000) return 'bg-warning text-background font-bold'; // Warning (Yellow)
    return 'bg-success text-background font-bold'; // OK (Green)
  }
}
