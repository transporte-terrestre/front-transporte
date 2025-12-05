import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConductorService } from '@service/admin/conductor.service';
import { ConductorResultDto, ConductorCreateDto, ConductorUpdateDto } from '@interface/admin/conductor.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { ConductorForm } from './layout/conductor-form/conductor-form';

@Component({
  selector: 'app-conductores',
  imports: [CommonModule, FormsModule, ModalForm, ConductorForm],
  templateUrl: './conductores.html',
  styleUrl: './conductores.css',
})
export class Conductores implements OnInit {
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  conductores = signal<ConductorResultDto[]>([]);
  filteredConductores = signal<ConductorResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedConductor = signal<ConductorResultDto | null>(null);
  searchTerm = '';

  conductorFormComponent = viewChild<ConductorForm>(ConductorForm);

  ngOnInit() {
    this.loadConductores();
  }

  loadConductores() {
    this.loading.set(true);
    this.conductorService.findAll().subscribe({
      next: (data) => {
        this.conductores.set(data);
        this.filteredConductores.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar conductores:', error);
        this.toastService.error('Error al cargar conductores');
        this.loading.set(false);
      },
    });
  }

  filterConductores() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredConductores.set(this.conductores());
      return;
    }

    const filtered = this.conductores().filter(conductor =>
      conductor.nombre.toLowerCase().includes(term) ||
      conductor.dni.includes(term) ||
      conductor.numeroLicencia.toLowerCase().includes(term)
    );
    this.filteredConductores.set(filtered);
  }

  openCreateModal() {
    this.editMode.set(false);
    this.selectedConductor.set(null);
    this.showModal.set(true);
  }

  openEditModal(conductor: ConductorResultDto) {
    this.editMode.set(true);
    this.selectedConductor.set(conductor);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedConductor.set(null);
  }

  handleFormSubmit(data: ConductorCreateDto | ConductorUpdateDto) {
    if (this.editMode()) {
      this.updateConductor(this.selectedConductor()!.id, data as ConductorUpdateDto);
    } else {
      this.createConductor(data as ConductorCreateDto);
    }
  }

  handleModalSubmit() {
    this.conductorFormComponent()?.submitForm();
  }

  createConductor(data: ConductorCreateDto) {
    this.loading.set(true);
    this.conductorService.create(data).subscribe({
      next: () => {
        this.toastService.success('Conductor creado exitosamente');
        this.loadConductores();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear conductor:', error);
        this.toastService.error('Error al crear conductor');
        this.loading.set(false);
      },
    });
  }

  updateConductor(id: number, data: ConductorUpdateDto) {
    this.loading.set(true);
    this.conductorService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Conductor actualizado exitosamente');
        this.loadConductores();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar conductor:', error);
        this.toastService.error('Error al actualizar conductor');
        this.loading.set(false);
      },
    });
  }

  deleteConductor(id: number) {
    this.alertService.delete(
      'Eliminar Conductor',
      '¿Estás seguro de que deseas eliminar este conductor? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.conductorService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Conductor eliminado exitosamente');
            this.loadConductores();
          },
          error: (error) => {
            console.error('Error al eliminar conductor:', error);
            this.toastService.error('Error al eliminar conductor');
            this.loading.set(false);
          },
        });
      }
    );
  }
}
