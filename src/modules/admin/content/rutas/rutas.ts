import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RutaService } from '@service/admin/ruta.service';
import { RutaResultDto, RutaCreateDto, RutaUpdateDto } from '@interface/admin/ruta.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { RutaForm } from './layout/ruta-form/ruta-form';

@Component({
  selector: 'app-rutas',
  imports: [CommonModule, FormsModule, ModalForm, RutaForm],
  templateUrl: './rutas.html',
  styleUrl: './rutas.css',
})
export class Rutas implements OnInit {
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private sanitizer = inject(DomSanitizer);

  rutas = signal<RutaResultDto[]>([]);
  filteredRutas = signal<RutaResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedRuta = signal<RutaResultDto | null>(null);
  searchTerm = '';
  viewMode = signal<'grid' | 'table'>('grid');

  rutaFormComponent = viewChild<RutaForm>(RutaForm);

  ngOnInit() {
    this.loadRutas();
  }

  loadRutas() {
    this.loading.set(true);
    this.rutaService.findAll().subscribe({
      next: (data) => {
        this.rutas.set(data);
        this.filteredRutas.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar rutas:', error);
        this.toastService.error('Error al cargar rutas');
        this.loading.set(false);
      },
    });
  }

  filterRutas() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredRutas.set(this.rutas());
      return;
    }

    const filtered = this.rutas().filter(ruta =>
      ruta.origen.toLowerCase().includes(term) ||
      ruta.destino.toLowerCase().includes(term)
    );
    this.filteredRutas.set(filtered);
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  openCreateModal() {
    this.editMode.set(false);
    this.selectedRuta.set(null);
    this.showModal.set(true);
  }

  openEditModal(ruta: RutaResultDto) {
    this.editMode.set(true);
    this.selectedRuta.set(ruta);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedRuta.set(null);
  }

  handleFormSubmit(data: RutaCreateDto | RutaUpdateDto) {
    if (this.editMode()) {
      this.updateRuta(this.selectedRuta()!.id, data as RutaUpdateDto);
    } else {
      this.createRuta(data as RutaCreateDto);
    }
  }

  handleModalSubmit() {
    this.rutaFormComponent()?.submitForm();
  }

  createRuta(data: RutaCreateDto) {
    this.loading.set(true);
    this.rutaService.create(data).subscribe({
      next: () => {
        this.toastService.success('Ruta creada exitosamente');
        this.loadRutas();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear ruta:', error);
        this.toastService.error('Error al crear ruta');
        this.loading.set(false);
      },
    });
  }

  updateRuta(id: number, data: RutaUpdateDto) {
    this.loading.set(true);
    this.rutaService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Ruta actualizada exitosamente');
        this.loadRutas();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar ruta:', error);
        this.toastService.error('Error al actualizar ruta');
        this.loading.set(false);
      },
    });
  }

  deleteRuta(id: number) {
    this.alertService.delete(
      'Eliminar Ruta',
      '¿Estás seguro de que deseas eliminar esta ruta? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.rutaService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Ruta eliminada exitosamente');
            this.loadRutas();
          },
          error: (error) => {
            console.error('Error al eliminar ruta:', error);
            this.toastService.error('Error al eliminar ruta');
            this.loading.set(false);
          },
        });
      }
    );
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getMapUrl(ruta: RutaResultDto): SafeResourceUrl {
    // Usar Google Maps con polyline para mostrar la línea de ruta
    const origin = `${ruta.origenLat},${ruta.origenLng}`;
    const destination = `${ruta.destinoLat},${ruta.destinoLng}`;

    // Construir URL de Google Maps con modo driving que dibuja la ruta
    const url = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}&mode=driving`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
