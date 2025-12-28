import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '@service/admin/cliente.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { ClienteForm } from '../../layout/cliente-form/cliente-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-clientes-edit',
  standalone: true,
  imports: [CommonModule, ClienteForm],
  templateUrl: './clientes-edit.html',
})
export class ClientesEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);

  cliente = signal<ApiResponse<'clientes', 'findOne'> | null>(null);
  loading = signal(false);

  clienteFormComponent = viewChild<ClienteForm>(ClienteForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCliente(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.clientes)]);
    }
  }

  loadCliente(id: number) {
    this.loading.set(true);
    this.clienteService
      .findOne(id)
      .then((cliente) => {
        this.cliente.set(cliente);
      })
      .catch((error) => {
        console.error('Error al cargar cliente:', error);
        this.toastService.error('Error al cargar cliente');
        this.router.navigate([buildPath(PATH.admin.clientes)]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  handleFormSubmit(data: ApiBody<'clientes', 'create'> | ApiBody<'clientes', 'update'>) {
    if (!this.cliente()) return;

    this.loading.set(true);
    this.clienteService
      .update(this.cliente()!.id, data as ApiBody<'clientes', 'update'>)
      .then(() => {
        this.toastService.success('Cliente actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.clientes)]);
      })
      .catch((error) => {
        console.error('Error al actualizar cliente:', error);
        this.toastService.error('Error al actualizar cliente');
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.clientes)]);
  }
}
