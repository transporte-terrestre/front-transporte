import { Component, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AbastecimientoService } from '@service/admin/abastecimiento.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApiResponse } from 'api/backend.api';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { ModalInfo } from '../../../../components/modal-info/modal-info';
import {
  AbastecimientoForm,
  AbastecimientoFormSubmitData,
} from '../../layout/abastecimiento-form/abastecimiento-form';
import { AbastecimientoDetail } from '../../layout/abastecimiento-detail/abastecimiento-detail';
import { PATH, buildPath } from '@route/path.route';

type Abastecimiento = ApiResponse<'abastecimientos', 'findAll'>['data'][number];
type VehiculoOption = ApiResponse<'vehiculos', 'findAll'>['data'][number];

@Component({
  selector: 'app-abastecimientos-list',
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    DatePipe,
    DecimalPipe,
    VehiculoInputSearch,
    ModalForm,
    ModalInfo,
    AbastecimientoForm,
    AbastecimientoDetail,
  ],
  templateUrl: './abastecimientos-list.html',
})
export class AbastecimientosList implements OnInit, OnDestroy {
  private abastecimientoService = inject(AbastecimientoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  abastecimientos = signal<Abastecimiento[]>([]);
  loading = signal(false);
  saving = signal(false);

  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'abastecimientos', 'findAll'>['meta'] | null>(null);

  searchTerm = signal('');
  selectedVehiculoId = signal<number | null>(null);
  selectedVehiculoForSearch = signal<VehiculoOption | null>(null);
  showForm = signal(false);
  editing = signal<Abastecimiento | null>(null);
  showDetailModal = signal(false);
  selectedAbastecimientoId = signal<number | null>(null);

  abastecimientoFormComponent = viewChild<AbastecimientoForm>(AbastecimientoForm);

  ngOnInit() {
    this.loadAbastecimientos();
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadAbastecimientos();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  async loadAbastecimientos() {
    this.loading.set(true);
    try {
      const result = await this.abastecimientoService.findAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        vehiculoId: this.selectedVehiculoId() || undefined,
      });
      this.abastecimientos.set(result.data || []);
      this.meta.set(result.meta);
    } catch (error) {
      console.error('Error cargando abastecimientos:', error);
      this.toastService.error('Error al cargar abastecimientos');
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onVehiculoFilterChange(vehiculo: VehiculoOption | null) {
    this.selectedVehiculoForSearch.set(vehiculo);
    this.selectedVehiculoId.set(vehiculo?.id || null);
    this.currentPage.set(1);
    this.loadAbastecimientos();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadAbastecimientos();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadAbastecimientos();
  }

  openCreate() {
    this.editing.set(null);
    this.showForm.set(true);
  }

  openEdit(item: Abastecimiento, event?: Event) {
    if (event) event.stopPropagation();
    const path = buildPath(PATH.admin.abastecimientos.edit).replace(':id', item.id.toString());
    this.router.navigate([path]);
  }

  closeForm() {
    if (this.saving()) return;
    this.showForm.set(false);
    this.editing.set(null);
  }

  handleModalSubmit() {
    this.abastecimientoFormComponent()?.submitForm();
  }

  viewDetails(id: number) {
    this.selectedAbastecimientoId.set(id);
    this.showDetailModal.set(true);
  }

  closeDetails() {
    this.showDetailModal.set(false);
    this.selectedAbastecimientoId.set(null);
  }

  async handleFormSubmit(data: AbastecimientoFormSubmitData) {
    this.saving.set(true);
    try {
      const editing = this.editing();
      if (editing) {
        await this.abastecimientoService.update(editing.id, data);
        this.toastService.success('Abastecimiento actualizado');
      } else {
        await this.abastecimientoService.create(data);
        this.toastService.success('Abastecimiento registrado');
      }

      this.closeForm();
      await this.loadAbastecimientos();
    } catch (error) {
      console.error('Error guardando abastecimiento:', error);
      this.toastService.error('Error al guardar abastecimiento');
    } finally {
      this.saving.set(false);
    }
  }

  deleteAbastecimiento(id: number, event?: Event) {
    if (event) event.stopPropagation();
    this.alertService.delete(
      'Eliminar Abastecimiento',
      '¿Estás seguro de que deseas eliminar este abastecimiento? Esta acción no se puede deshacer.',
      async () => {
        this.loading.set(true);
        try {
          await this.abastecimientoService.delete(id);
          this.toastService.success('Abastecimiento eliminado');
          await this.loadAbastecimientos();
        } catch (error) {
          console.error('Error eliminando abastecimiento:', error);
          this.toastService.error('Error al eliminar abastecimiento');
          this.loading.set(false);
        }
      },
    );
  }

  getVehiculoLabel(item: Abastecimiento) {
    return item.vehiculoPlaca || 'Sin placa';
  }

  getVehiculoImage(item: Abastecimiento) {
    return item.vehiculoImagenes?.[0] || null;
  }
}
