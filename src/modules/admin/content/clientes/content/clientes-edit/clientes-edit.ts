import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '@service/admin/cliente.service';
import { ClienteResultDto, ClienteUpdateDto } from '@interface/admin/cliente.interface';
import { ToastService } from '@service/toast.service';
import { ClienteForm } from '../../layout/cliente-form/cliente-form';
import { PATH, getPath } from '@route/path.route';

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

  cliente = signal<ClienteResultDto | null>(null);
  loading = signal(false);

  clienteFormComponent = viewChild<ClienteForm>(ClienteForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCliente(+id);
    } else {
      this.router.navigate([getPath(PATH.admin.clientes)]);
    }
  }

  loadCliente(id: number) {
    this.loading.set(true);
    this.clienteService.findOne(id).subscribe({
      next: (cliente) => {
        this.cliente.set(cliente);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar cliente:', error);
        this.toastService.error('Error al cargar cliente');
        this.router.navigate([getPath(PATH.admin.clientes)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.cliente()) return;

    this.loading.set(true);
    this.clienteService.update(this.cliente()!.id, data as ClienteUpdateDto).subscribe({
      next: () => {
        this.toastService.success('Cliente actualizado exitosamente');
        this.router.navigate([getPath(PATH.admin.clientes)]);
      },
      error: (error) => {
        console.error('Error al actualizar cliente:', error);
        this.toastService.error('Error al actualizar cliente');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate([getPath(PATH.admin.clientes)]);
  }
}
