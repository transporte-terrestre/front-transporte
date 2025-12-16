import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { TallerService } from '@service/admin/taller.service';
import {
  MantenimientoResultDto,
  MantenimientoCreateDto,
  TipoMantenimiento,
  PaginationMeta,
} from '@interface/admin/mantenimiento.interface';
import { VehiculoListDto } from '@interface/admin/vehiculo.interface';
import { TallerResultDto } from '@interface/admin/taller.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { MantenimientoForm } from '../../layout/mantenimiento-form/mantenimiento-form';
import { PATH, buildPath } from '@route/path.route';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  mantenimientos: MantenimientoResultDto[];
}

@Component({
  selector: 'app-mantenimientos-list',
  imports: [CommonModule, FormsModule, ModalForm, MantenimientoForm],
  templateUrl: './mantenimientos-list.html',
  styleUrl: './mantenimientos-list.css',
})
export class MantenimientosList implements OnInit {
  private mantenimientoService = inject(MantenimientoService);
  private vehiculoService = inject(VehiculoService);
  private tallerService = inject(TallerService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mantenimientos = signal<MantenimientoResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  selectedDate = signal<Date | null>(null);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<PaginationMeta | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  // Calendario
  currentDate = signal(new Date());
  calendarDays = signal<CalendarDay[]>([]);
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

  // Catálogos
  vehiculos = signal<Map<number, VehiculoListDto>>(new Map());
  talleres = signal<Map<number, TallerResultDto>>(new Map());

  // Día seleccionado para ver detalles
  selectedDay = signal<CalendarDay | null>(null);
  showDayDetails = signal(false);

  mantenimientoFormComponent = viewChild<MantenimientoForm>(MantenimientoForm);

  ngOnInit() {
    this.loadCatalogos();
    this.loadMantenimientos();
  }

  loadCatalogos() {
    this.vehiculoService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const map = new Map<number, VehiculoListDto>();
        response.data.forEach((v) => map.set(v.id, v));
        this.vehiculos.set(map);
      },
    });

    this.tallerService.findAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const map = new Map<number, TallerResultDto>();
        response.data.forEach((t) => map.set(t.id, t));
        this.talleres.set(map);
      },
    });
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
      })
      .subscribe({
        next: (response) => {
          this.mantenimientos.set(response.data);
          this.meta.set(response.meta);
          this.generateCalendar();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar mantenimientos:', error);
          this.toastService.error('Error al cargar mantenimientos');
          this.loading.set(false);
        },
      });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadMantenimientos();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadMantenimientos();
  }

  onPageSizeChange() {
    this.currentPage.set(1);
    this.loadMantenimientos();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadMantenimientos();
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

  getMantenimientosByDate(date: Date): MantenimientoResultDto[] {
    const dateStr = this.formatDateToCompare(date);
    return this.mantenimientos().filter((m) => {
      // Crear fecha sin considerar zona horaria
      const fechaParts = m.fechaIngreso.split('T')[0].split('-');
      const mantDate = new Date(
        Number(fechaParts[0]),
        Number(fechaParts[1]) - 1,
        Number(fechaParts[2])
      );
      const mantDateStr = this.formatDateToCompare(mantDate);
      return mantDateStr === dateStr;
    });
  }

  formatDateToCompare(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  }

  previousMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1));
    this.generateCalendar();
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1));
    this.generateCalendar();
  }

  goToToday() {
    this.currentDate.set(new Date());
    this.generateCalendar();
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

  navigateToEdit(mantenimiento: MantenimientoResultDto) {
    const path = buildPath(PATH.admin.mantenimientos.edit).replace(
      ':id',
      mantenimiento.id.toString()
    );
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedDate.set(null);
  }

  handleFormSubmit(data: any) {
    this.createMantenimiento(data as MantenimientoCreateDto);
  }

  handleModalSubmit() {
    this.mantenimientoFormComponent()?.submitForm();
  }

  createMantenimiento(data: MantenimientoCreateDto) {
    this.loading.set(true);
    this.mantenimientoService.create(data).subscribe({
      next: () => {
        this.toastService.success('Mantenimiento registrado exitosamente');
        this.loadMantenimientos();
        this.closeModal();
        this.closeDayDetails();
      },
      error: (error) => {
        console.error('Error al crear mantenimiento:', error);
        this.toastService.error('Error al registrar mantenimiento');
        this.loading.set(false);
      },
    });
  }

  deleteMantenimiento(id: number) {
    this.alertService.delete(
      'Eliminar Mantenimiento',
      '¿Estás seguro de que deseas eliminar este registro de mantenimiento? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.mantenimientoService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Mantenimiento eliminado exitosamente');
            this.loadMantenimientos();
            this.closeDayDetails();
          },
          error: (error) => {
            console.error('Error al eliminar mantenimiento:', error);
            this.toastService.error('Error al eliminar mantenimiento');
            this.loading.set(false);
          },
        });
      }
    );
  }

  getTallerDisplay(tallerId: number): string {
    const taller = this.talleres().get(tallerId);
    return taller ? taller.nombre : `Taller #${tallerId}`;
  }

  getVehiculoDisplay(vehiculoId: number): string {
    const vehiculo = this.vehiculos().get(vehiculoId);
    return vehiculo
      ? `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`
      : `Vehículo #${vehiculoId}`;
  }

  getVehiculoPlaca(vehiculoId: number): string {
    const vehiculo = this.vehiculos().get(vehiculoId);
    return vehiculo ? vehiculo.placa : `#${vehiculoId}`;
  }

  getTipoBadgeClass(tipo: TipoMantenimiento): string {
    switch (tipo) {
      case 'preventivo':
        return 'bg-info/10 text-info';
      case 'correctivo':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-text/10 text-text';
    }
  }

  getTipoIcon(tipo: TipoMantenimiento): string {
    switch (tipo) {
      case 'preventivo':
        return 'fa-shield-alt';
      case 'correctivo':
        return 'fa-wrench';
      default:
        return 'fa-tools';
    }
  }

  getTipoLabel(tipo: TipoMantenimiento): string {
    switch (tipo) {
      case 'preventivo':
        return 'Preventivo';
      case 'correctivo':
        return 'Correctivo';
      default:
        return tipo;
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
}
