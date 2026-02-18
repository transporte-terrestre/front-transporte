import { Component, signal, inject, OnInit, OnDestroy, viewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RutaService } from '@service/admin/ruta.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';
import { RutaForm } from '../../layout/ruta-form/ruta-form';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-rutas-list',
  imports: [CommonModule, FormsModule, ModalForm, RutaForm, PaginationComponent],
  templateUrl: './rutas-list.html',
  styleUrl: './rutas-list.css',
})
export class RutasList implements OnInit, OnDestroy {
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private searchSubject = new Subject<string>();

  rutas = signal<ApiResponse<'rutas', 'findAllCircuitos'>['data']>([]);
  loading = signal(false);
  showModal = signal(false);
  viewMode = signal<'grid' | 'table'>('table');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);
  meta = signal<ApiResponse<'rutas', 'findAllCircuitos'>['meta'] | null>(null);

  // Filtros
  searchTerm = signal('');
  fechaInicio = signal('');
  fechaFin = signal('');

  rutaFormComponent = viewChild<RutaForm>(RutaForm);

  ngOnInit() {
    this.loadRutas();

    // Configurar debounce para el buscador
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadRutas() {
    this.loading.set(true);
    this.rutaService
      .findAllCircuitos({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        fechaInicio: this.fechaInicio() || undefined,
        fechaFin: this.fechaFin() || undefined,
      })
      .then((response) => {
        this.rutas.set(response.data);
        this.meta.set(response.meta);
      })
      .catch((error) => {
        console.error('Error al cargar rutas:', error);
        this.toastService.error('Error al cargar rutas');
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  processedRows = computed(() => {
    const rows: {
      circuito: ApiResponse<'rutas', 'findAllCircuitos'>['data'][0];
      ruta: ApiResponse<'rutas', 'findAll'>['data'][0] | null;
      tipo: 'ida' | 'vuelta';
      isFirst: boolean;
      rowSpan: number;
    }[] = [];

    this.rutas().forEach((circuito) => {
      const subRows: { tipo: 'ida' | 'vuelta'; ruta: any }[] = [];
      if (circuito.rutaIda) subRows.push({ tipo: 'ida', ruta: circuito.rutaIda });
      if (circuito.rutaVuelta) subRows.push({ tipo: 'vuelta', ruta: circuito.rutaVuelta });

      // Si no hay rutas (caso raro), mostrar al menos una fila vacía o manejarlo
      if (subRows.length === 0) {
        rows.push({
          circuito,
          ruta: null,
          tipo: 'ida', // default
          isFirst: true,
          rowSpan: 1,
        });
        return;
      }

      subRows.forEach((sub, index) => {
        rows.push({
          circuito,
          ruta: sub.ruta,
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
    this.loadRutas();
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
    this.loadRutas();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.loadRutas();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.currentPage.set(1);
    this.loadRutas();
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  navigateToEdit(circuito: any) {
    const path = buildPath(PATH.admin.rutas.edit).replace(':id', circuito.id.toString());
    this.router.navigate([path]);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleFormSubmit(data: ApiBody<'rutas', 'createCircuito'> | any) {
    this.createRuta(data as ApiBody<'rutas', 'createCircuito'>);
  }

  handleModalSubmit() {
    this.rutaFormComponent()?.submitForm();
  }

  createRuta(data: ApiBody<'rutas', 'createCircuito'>) {
    this.loading.set(true);
    this.rutaService
      .create(data)
      .then(() => {
        this.toastService.success('Ruta creada exitosamente');
        this.loadRutas();
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al crear ruta:', error);
        this.toastService.error(getErrorMessage(error, 'Error al crear ruta'));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  deleteRuta(id: number) {
    this.alertService.delete(
      'Eliminar Circuito',
      '¿Estás seguro que deseas eliminar este circuito y sus rutas asociadas?',
      () => {
        this.loading.set(true);
        this.rutaService
          .delete(id)
          .then(() => {
            this.toastService.success('Circuito eliminado correctamente');
            this.loadRutas();
          })
          .catch((error) => {
            console.error('Error al eliminar circuito:', error);
            this.toastService.error(getErrorMessage(error, 'Error al eliminar circuito'));
          })
          .finally(() => {
            this.loading.set(false);
          });
      },
    );
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getMapUrl(ruta: ApiResponse<'rutas', 'findAll'>['data'][number]): SafeResourceUrl {
    // Usar Google Maps con polyline para mostrar la línea de ruta
    const origin = `${ruta.origenLat},${ruta.origenLng}`;
    const destination = `${ruta.destinoLat},${ruta.destinoLng}`;

    // Construir URL de Google Maps con modo driving que dibuja la ruta
    const url = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}&mode=driving`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
