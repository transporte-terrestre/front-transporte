import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'api/backend.api';
import { ClienteService } from '@service/admin/cliente.service';

type Cliente = ApiResponse<'clientes', 'findOne'> & { documentos: any };

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-detail.html',
  styleUrl: './cliente-detail.css',
})
export class ClienteDetail {
  clienteId = input<number>();
  private clienteService = inject(ClienteService);

  cliente = signal<Cliente | null>(null);
  pasajeros = signal<any[]>([]);
  encargados = signal<any[]>([]);
  entidades = signal<any[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.clienteId();
      if (id) {
        this.loadClienteData(id);
      }
    });
  }

  async loadClienteData(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.clienteService.findOne(id);
      this.cliente.set(data as any);

      // Cargar relaciones
      Promise.all([
        this.clienteService.findAllPasajeros({ clienteId: id, limit: 100, page: 1 }),
        this.clienteService.findAllEncargados({ clienteId: id, limit: 100, page: 1 }),
        this.clienteService.findAllEntidades({ clienteId: id, limit: 100, page: 1 }),
      ])
        .then(([pasajerosRes, encargadosRes, entidadesRes]) => {
          this.pasajeros.set(pasajerosRes.data);
          this.encargados.set(encargadosRes.data);
          this.entidades.set(entidadesRes.data);
        })
        .catch((err) => {
          console.error('Error al cargar relaciones:', err);
        });

    } catch (err) {
      console.error('Error loading cliente:', err);
      this.error.set('Error al cargar la información del cliente');
    } finally {
      this.loading.set(false);
    }
  }

  getDocumentosByType(type: string) {
    const v = this.cliente();
    if (!v || !v.documentos) return [];

    // Si es array (flat), filtramos
    if (Array.isArray(v.documentos)) {
      return v.documentos.filter((d: any) => d.tipo === type);
    }

    // Si es objeto (agrupado por tipo), accedemos por key
    return (v.documentos as any)[type] || [];
  }

  documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'ruc', label: 'RUC' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'carta_compromiso', label: 'Carta de Compromiso' },
    { value: 'ficha_ruc', label: 'Ficha RUC' },
    { value: 'otros', label: 'Otros' },
  ];
}
