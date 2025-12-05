import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '@service/admin/cliente.service';
import { ClienteResultDto, ClienteCreateDto, ClienteUpdateDto } from '@interface/admin/cliente.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ModalForm } from '../../components/modal-form/modal-form';
import { ClienteForm } from './layout/cliente-form/cliente-form';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, ModalForm, ClienteForm],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  clientes = signal<ClienteResultDto[]>([]);
  filteredClientes = signal<ClienteResultDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  selectedCliente = signal<ClienteResultDto | null>(null);
  searchTerm = '';

  clienteFormComponent = viewChild<ClienteForm>(ClienteForm);

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.loading.set(true);
    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.filteredClientes.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.toastService.error('Error al cargar clientes');
        this.loading.set(false);
      },
    });
  }

  filterClientes() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredClientes.set(this.clientes());
      return;
    }

    const filtered = this.clientes().filter(cliente =>
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.apellido.toLowerCase().includes(term) ||
      cliente.dni.toLowerCase().includes(term) ||
      (cliente.email && cliente.email.toLowerCase().includes(term))
    );
    this.filteredClientes.set(filtered);
  }

  openCreateModal() {
    this.editMode.set(false);
    this.selectedCliente.set(null);
    this.showModal.set(true);
  }

  openEditModal(cliente: ClienteResultDto) {
    this.editMode.set(true);
    this.selectedCliente.set(cliente);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedCliente.set(null);
  }

  handleFormSubmit(data: ClienteCreateDto | ClienteUpdateDto) {
    if (this.editMode()) {
      this.updateCliente(this.selectedCliente()!.id, data as ClienteUpdateDto);
    } else {
      this.createCliente(data as ClienteCreateDto);
    }
  }

  handleModalSubmit() {
    this.clienteFormComponent()?.submitForm();
  }

  createCliente(data: ClienteCreateDto) {
    this.loading.set(true);
    this.clienteService.create(data).subscribe({
      next: () => {
        this.toastService.success('Cliente creado exitosamente');
        this.loadClientes();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        this.toastService.error('Error al crear cliente');
        this.loading.set(false);
      },
    });
  }

  updateCliente(id: number, data: ClienteUpdateDto) {
    this.loading.set(true);
    this.clienteService.update(id, data).subscribe({
      next: () => {
        this.toastService.success('Cliente actualizado exitosamente');
        this.loadClientes();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar cliente:', error);
        this.toastService.error('Error al actualizar cliente');
        this.loading.set(false);
      },
    });
  }

  deleteCliente(id: number) {
    this.alertService.delete(
      'Eliminar Cliente',
      '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      () => {
        this.loading.set(true);
        this.clienteService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Cliente eliminado exitosamente');
            this.loadClientes();
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            this.toastService.error('Error al eliminar cliente');
            this.loading.set(false);
          },
        });
      }
    );
  }
}
