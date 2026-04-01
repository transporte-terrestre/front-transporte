import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuditoriaService } from '@service/admin/auditoria.service';
import { ToastService } from '@service/toast.service';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { ApiResponse } from 'api/backend.api';

@Component({
  selector: 'app-historial-list',
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe],
  templateUrl: './historial-list.html',
})
export class HistorialList implements OnInit, OnDestroy {
  private auditoriaService = inject(AuditoriaService);
  private toastService = inject(ToastService);
  private searchSubject = new Subject<string>();

  auditorias = signal<ApiResponse<'auditorias', 'findAll'>['data']>([]);
  loading = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'auditorias', 'findAll'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  // Nuevos filtros estilo "Viajes"
  fechaDia = signal('');
  mesSeleccionado = signal(this.getCurrentMonth());

  ngOnInit() {
    // Inicializar rango con el mes actual
    this.setMonthRange(this.mesSeleccionado());
    this.loadAuditorias();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadAuditorias();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
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
    this.fechaInicio.set(firstDay + 'T00:00:00');
    this.fechaFin.set(lastDayStr + 'T23:59:59');
  }

  onMonthChange(value: string) {
    this.mesSeleccionado.set(value);
    this.fechaDia.set(''); // Limpiar día si cambia mes
    this.setMonthRange(value);
    this.currentPage.set(1);
    this.loadAuditorias();
  }

  onDiaChange(value: string) {
    this.fechaDia.set(value);
    if (value) {
      this.fechaInicio.set(value + 'T00:00:00');
      this.fechaFin.set(value + 'T23:59:59');
    } else {
      this.setMonthRange(this.mesSeleccionado());
    }
    this.currentPage.set(1);
    this.loadAuditorias();
  }

  loadAuditorias() {
    this.loading.set(true);

    this.auditoriaService
      .findAll({
        limit: this.pageSize(),
        page: this.currentPage(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.auditorias.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar historial:', error);
        this.toastService.error('Error al cargar historial de auditoría');
        this.loading.set(false);
      });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadAuditorias();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadAuditorias();
  }

  refresh() {
    this.loadAuditorias();
  }

  // Mantenemos esto por si quieres resetear todo, pero el botón ahora dirá Refrescar
  resetFilters() {
    this.searchTerm.set('');
    this.fechaDia.set('');
    this.mesSeleccionado.set(this.getCurrentMonth());
    this.setMonthRange(this.mesSeleccionado());
    this.currentPage.set(1);
    this.loadAuditorias();
  }
}
