import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '@service/admin/cliente.service';
import { AlquilerService } from '@service/admin/alquiler.service';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiResponse } from 'api/backend.api';

@Component({
  selector: 'app-reportes-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-clientes.html',
  styleUrl: './reportes-clientes.css',
})
export class ReportesClientes implements OnInit {
  private clienteService = inject(ClienteService);
  private alquilerService = inject(AlquilerService);
  private vehiculoService = inject(VehiculoService);

  clientes = signal<ApiResponse<'clientes', 'findAll'>['data']>([]);
  loading = signal(false);
  
  // Paginación
  currentPage = signal(1);
  totalPages = signal(1);
  pageSize = 10;

  selectedClientId = signal<number | null>(null);
  selectedClient = signal<ApiResponse<'clientes', 'findOne'> | null>(null);
  
  // Detalle Data
  alquileres = signal<ApiResponse<'alquileres', 'findAll'>['data']>([]);
  vehiculos = signal<ApiResponse<'vehiculos', 'findAll'>['data']>([]);
  entidades = signal<ApiResponse<'clientes', 'findAllEntidades'>['data']>([]);
  pasajeros = signal<ApiResponse<'clientes', 'findAllPasajeros'>['data']>([]);

  totalAlquileresCostByCurrency = computed(() => {
    return this.alquileres().reduce(
      (acc, alquiler) => {
        const moneda = alquiler.moneda === 'USD' ? 'USD' : 'PEN';
        acc[moneda] += this.calculateRentalCost(alquiler);
        return acc;
      },
      { PEN: 0, USD: 0 },
    );
  });
  
  loadingDetail = signal(false);

  ngOnInit(): void {
    this.loadClientes();
  }

  calculateRentalCost(alquiler: ApiResponse<'alquileres', 'findAll'>['data'][number]): number {
    const start = new Date(alquiler.fechaInicio);
    const end = alquiler.fechaFin ? new Date(alquiler.fechaFin) : new Date();
    
    // Calcular diferencia en días (mínimo 1 día)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const numVehiculos = (alquiler.detalles?.length || 0);
    return diffDays * (alquiler.montoPorDia || 0) * (numVehiculos || 1);
  }

  formatCurrency(
    value: string | number | null | undefined,
    moneda: 'PEN' | 'USD' | null | undefined,
  ): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  async loadClientes(append = false) {
    if (this.loading()) return;
    
    this.loading.set(true);
    try {
      const response = await this.clienteService.findAll({
        page: this.currentPage(),
        limit: this.pageSize
      });

      if (append) {
        this.clientes.update(prev => [...prev, ...response.data]);
      } else {
        this.clientes.set(response.data);
      }

      this.totalPages.set(response.meta.totalPages);
    } catch (error) {
      console.error('Error loading clientes for report:', error);
    } finally {
      this.loading.set(false);
    }
  }

  loadMore() {
    if (this.currentPage() < this.totalPages() && !this.loading()) {
      this.currentPage.update(p => p + 1);
      this.loadClientes(true);
    }
  }

  onListScroll(event: Event) {
    const element = event.target as HTMLElement;
    const pos = element.scrollTop + element.offsetHeight;
    const max = element.scrollHeight;
    
    // Si estamos al 85% del final del contenedor, cargar más
    if (pos > max * 0.85) {
      this.loadMore();
    }
  }

  async selectClient(id: number) {
    if (this.selectedClientId() === id) return;
    
    this.selectedClientId.set(id);
    this.loadingDetail.set(true);
    
    try {
      // Fetch everything in parallel
      const [client, alquileresRes, vehiculosRes, entidadesRes, pasajerosRes] = await Promise.all([
        this.clienteService.findOne(id),
        this.alquilerService.findAll({ clienteId: id, limit: 100 }).catch(() => ({ data: [] })),
        this.vehiculoService.findAll({ propietarioId: id, limit: 100 }).catch(() => ({ data: [] })),
        this.clienteService.findAllEntidades({ clienteId: id, limit: 100 }).catch(() => ({ data: [] })),
        this.clienteService.findAllPasajeros({ clienteId: id, limit: 100 }).catch(() => ({ data: [] }))
      ]);

      this.selectedClient.set(client);
      this.alquileres.set(alquileresRes.data);
      this.vehiculos.set(vehiculosRes.data);
      this.entidades.set(entidadesRes.data);
      this.pasajeros.set(pasajerosRes.data);

    } catch (error) {
      console.error('Error loading client details:', error);
    } finally {
      this.loadingDetail.set(false);
    }
  }
}
