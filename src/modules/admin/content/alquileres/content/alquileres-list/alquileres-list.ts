import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { AlquilerForm } from '../../layout/alquiler-form/alquiler-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { AlquilerEstadoUpdate } from './layout/alquiler-estado-update/alquiler-estado-update';
import { AlquilerTerminarModal } from './layout/alquiler-terminar-modal/alquiler-terminar-modal';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';
import { ReactiveFormsModule } from '@angular/forms';
import { ClienteInputSearch } from '../../../../components/input-searchs/cliente-input-search/cliente-input-search';
import { ConductorInputSearch } from '../../../../components/input-searchs/conductor-input-search/conductor-input-search';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-alquileres-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalForm,
    AlquilerForm,
    PaginationComponent,
    AlquilerEstadoUpdate,
    AlquilerTerminarModal,
    ClienteInputSearch,
    ConductorInputSearch,
    VehiculoInputSearch,
  ],
  templateUrl: './alquileres-list.html',
  styleUrl: './alquileres-list.css',
})
export class AlquileresList implements OnInit {
  private alquilerService = inject(AlquilerService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  alquileres = signal<ApiResponse<'alquileres', 'findAll'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'alquileres', 'findAll'>['meta'] | null>(null);

  // Filtros
  showFilters = signal(false);
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');
  fechaDia = signal('');
  mesSeleccionado = signal(this.getCurrentMonth());
  estado = signal('');
  tipo = signal('');
  clienteId = signal<number | string>('');
  selectedClienteForSearch = signal<ApiResponse<'clientes', 'findAll'>['data'][number] | null>(null);
  conductorId = signal<number | string>('');
  selectedConductorForSearch = signal<ApiResponse<'conductores', 'findAll'>['data'][number] | null>(null);
  vehiculoId = signal<number | string>('');
  selectedVehiculoForSearch = signal<ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(null);

  formComponent = viewChild<AlquilerForm>('formComponent');

  ngOnInit() {
    this.setMonthRange(this.mesSeleccionado());
    this.loadAlquileres();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  async loadAlquileres() {
    this.loading.set(true);
    try {
      const response = await this.alquilerService.findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        estado: (this.estado() as any) || undefined,
        tipo: (this.tipo() as any) || undefined,
        clienteId: this.clienteId() ? Number(this.clienteId()) : undefined,
        conductorId: this.conductorId() ? Number(this.conductorId()) : undefined,
        vehiculoId: this.vehiculoId() ? Number(this.vehiculoId()) : undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      });
      this.alquileres.set(response.data);
      this.meta.set(response.meta);
      this.loading.set(false);
    } catch (error) {
      console.error('Error al cargar alquileres:', error);
      this.toastService.error(getErrorMessage(error, 'Error al cargar alquileres'));
      this.loading.set(false);
    }
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadAlquileres();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadAlquileres();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadAlquileres();
  }

  onFilterChange() {
    this.onSearch();
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

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.fechaDia.set('');
    this.mesSeleccionado.set(this.getCurrentMonth());
    this.setMonthRange(this.mesSeleccionado());
    this.estado.set('');
    this.tipo.set('');
    this.clienteId.set('');
    this.selectedClienteForSearch.set(null);
    this.conductorId.set('');
    this.selectedConductorForSearch.set(null);
    this.vehiculoId.set('');
    this.selectedVehiculoForSearch.set(null);
    this.currentPage.set(1);
    this.loadAlquileres();
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'>) {
    this.createAlquiler(data);
  }

  async createAlquiler(data: ApiBody<'alquileres', 'create'> | ApiBody<'alquileres', 'update'>) {
    this.loading.set(true);
    try {
      await this.alquilerService.create(data as ApiBody<'alquileres', 'create'>);
      this.toastService.success('Alquiler creado exitosamente');
      this.loadAlquileres();
      this.closeModal();
    } catch (error) {
      console.error('Error al crear alquiler:', error);
      this.toastService.error(getErrorMessage(error, 'Error al crear alquiler'));
      this.loading.set(false);
    }
  }

  navigateToEdit(alquiler: ApiResponse<'alquileres', 'findAll'>['data'][number]) {
    const path = buildPath(PATH.admin.alquileres.edit).replace(':id', alquiler.id.toString());
    this.router.navigate([path]);
  }


  deleteAlquiler(id: number, event: Event) {
    event.stopPropagation();
    this.alertService.delete(
      'Eliminar Alquiler',
      '¿Estás seguro de que deseas eliminar este alquiler? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.alquilerService.delete(id).then(
          () => {
            this.toastService.success('Alquiler eliminado exitosamente');
            this.loadAlquileres();
          },
          (error) => {
            console.error('Error al eliminar alquiler:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar alquiler'));
            this.loading.set(false);
          },
        );
      },
    );
  }

  exportToExcel() {
    if (this.alquileres().length === 0) {
      this.toastService.warning('No hay datos para exportar');
      return;
    }

    const data = this.alquileres().map((a: any) => {
      const placas = a.detalles?.map((d: any) => d.vehiculo?.placa).filter(Boolean).join(', ') || '—';
      const conductores = a.detalles?.map((d: any) => d.conductor?.nombreCompleto).filter(Boolean).join(', ') || '—';
      const tipo = a.detalles?.[0]?.tipo === 'maquina_operada' ? 'Máquina Operada' : 'Máquina Seca';
      
      return {
        ID: a.id,
        Cliente: a.cliente?.razonSocial || a.cliente?.nombreCompleto || '—',
        Tipo: tipo,
        Vehículos: placas,
        Conductores: conductores,
        'Fecha Inicio': a.fechaInicio ? new Date(a.fechaInicio).toLocaleDateString() : '—',
        'Fecha Fin': a.fechaFin ? new Date(a.fechaFin).toLocaleDateString() : '—',
        'Es Indefinido': a.esIndefinido ? 'Sí' : 'No',
        'Monto por Día': `S/ ${a.montoPorDia}`,
        'Monto Total Final': a.montoTotalFinal ? `S/ ${a.montoTotalFinal}` : '—',
        Estado: this.getEstadoLabel(a.estado),
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alquileres');
    XLSX.writeFile(wb, `Reporte_Alquileres_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  private getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  getDiffDias(start: string | Date, end: string | Date): number {
    const pStart = new Date(start);
    const pEnd = new Date(end);
    const diffTime = Math.abs(pEnd.getTime() - pStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

}
