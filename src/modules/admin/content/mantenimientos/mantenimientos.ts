import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { MantenimientoResultDto, MantenimientoCreateDto, MantenimientoUpdateDto, TipoMantenimiento } from '@interface/admin/mantenimiento.interface';
import { VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { MantenimientoForm } from './layout/mantenimiento-form/mantenimiento-form';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  mantenimientos: MantenimientoResultDto[];
}

@Component({
  selector: 'app-mantenimientos',
  imports: [CommonModule, FormsModule, ModalForm, MantenimientoForm],
  templateUrl: './mantenimientos.html',
  styleUrl: './mantenimientos.css',
})
export class Mantenimientos implements OnInit {
  private mantenimientoService = inject(MantenimientoService);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  mantenimientos = signal<MantenimientoResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedMantenimiento = signal<MantenimientoResultDto | null>(null);
  selectedDate = signal<Date | null>(null);

  // Calendario
  currentDate = signal(new Date());
  calendarDays = signal<CalendarDay[]>([]);
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Catálogo para mostrar nombres de vehículos
  vehiculos = signal<Map<number, VehiculoResultDto>>(new Map());

  // Día seleccionado para ver detalles
  selectedDay = signal<CalendarDay | null>(null);
  showDayDetails = signal(false);

  mantenimientoFormComponent = viewChild<MantenimientoForm>(MantenimientoForm);

  ngOnInit() {
    this.loadCatalogos();
    this.loadMantenimientos();
  }

  loadCatalogos() {
    this.vehiculoService.findAll().subscribe({
      next: (data) => {
        const map = new Map<number, VehiculoResultDto>();
        data.forEach(v => map.set(v.id, v));
        this.vehiculos.set(map);
      },
    });
  }

  loadMantenimientos() {
    this.loading.set(true);
    this.mantenimientoService.findAll().subscribe({
      next: (data) => {
        this.mantenimientos.set(data);
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
        mantenimientos: this.getMantenimientosByDate(date)
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
        mantenimientos: this.getMantenimientosByDate(date)
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
        mantenimientos: this.getMantenimientosByDate(date)
      });
    }

    this.calendarDays.set(days);
  }

  getMantenimientosByDate(date: Date): MantenimientoResultDto[] {
    const dateStr = this.formatDateToCompare(date);
    return this.mantenimientos().filter(m => {
      // Crear fecha sin considerar zona horaria
      const fechaParts = m.fecha.split('-');
      const mantDate = new Date(Number(fechaParts[0]), Number(fechaParts[1]) - 1, Number(fechaParts[2]));
      const mantDateStr = this.formatDateToCompare(mantDate);
      return mantDateStr === dateStr;
    });
  }

  formatDateToCompare(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
    this.editMode.set(false);
    this.selectedMantenimiento.set(null);
    this.showModal.set(true);
  }

  openCreateModalFromDay(date: Date) {
    this.selectedDate.set(date);
    this.closeDayDetails();
    this.openCreateModal();
  }

  openEditModal(mantenimiento: MantenimientoResultDto) {
    this.editMode.set(true);
    this.selectedMantenimiento.set(mantenimiento);
    this.closeDayDetails();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedMantenimiento.set(null);
    this.selectedDate.set(null);
  }

  handleFormSubmit(data: MantenimientoCreateDto | MantenimientoUpdateDto) {
    if (this.editMode()) {
      this.updateMantenimiento(this.selectedMantenimiento()!.id, data as MantenimientoUpdateDto);
    } else {
      this.createMantenimiento(data as MantenimientoCreateDto);
    }
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

  updateMantenimiento(id: number, data: MantenimientoUpdateDto) {
    this.loading.set(true);
    this.mantenimientoService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Mantenimiento actualizado exitosamente');
        this.loadMantenimientos();
        this.closeModal();
        this.closeDayDetails();
      },
      error: (error) => {
        console.error('Error al actualizar mantenimiento:', error);
        this.toastService.error('Error al actualizar mantenimiento');
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

  getVehiculoDisplay(vehiculoId: number): string {
    const vehiculo = this.vehiculos().get(vehiculoId);
    return vehiculo ? `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}` : `Vehículo #${vehiculoId}`;
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
