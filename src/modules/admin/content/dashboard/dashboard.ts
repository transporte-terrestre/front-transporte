import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DashboardService } from '@service/admin/dashboard.service';
import { ToastService } from '@service/toast.service';

import {
  DashboardStatsDto,
  VehiculosPorEstadoItemDto,
  ViajeRecienteDto,
  MantenimientoProximoDto,
  RutaPopularDto,
  IngresoMensualDto,
} from 'api/backend.api';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  trend: 'up' | 'down';
}

interface VehiculoEstadoVM {
  estado: string;
  cantidad: number;
  color: string;
  porcentaje: number;
}

interface ViajeRecienteVM {
  id: number;
  ruta: string;
  conductor: string;
  vehiculo: string;
  estado: string;
  hora: string;
  color: string;
}

interface MantenimientoProximoVM extends MantenimientoProximoDto {}
interface RutaPopularVM extends RutaPopularDto {}
interface IngresoMensualVM extends IngresoMensualDto {}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private toastService = inject(ToastService);

  loading = signal(true);

  // Estadísticas generales
  stats = signal<StatCard[]>([]);

  // Vehículos por estado
  vehiculosPorEstado = signal<VehiculoEstadoVM[]>([]);

  // Viajes recientes
  viajesRecientes = signal<ViajeRecienteVM[]>([]);

  // Mantenimientos próximos
  mantenimientosProximos = signal<MantenimientoProximoVM[]>([]);

  // Rutas más utilizadas
  rutasPopulares = signal<RutaPopularVM[]>([]);

  // Ingresos mensuales
  ingresosMensuales = signal<IngresoMensualVM[]>([]);

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    this.loading.set(true);

    Promise.all([
      this.loadStats(),
      this.loadVehiculosPorEstado(),
      this.loadViajesRecientes(),
      this.loadMantenimientosProximos(),
      this.loadRutasPopulares(),
      this.loadIngresosMensuales(),
    ])
      .catch((error) => {
        console.error('Error loading dashboard data', error);
        this.toastService.error('Error al cargar datos del dashboard');
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  private loadStats() {
    return this.dashboardService.getStats().then((data: DashboardStatsDto) => {
      this.stats.set([
        {
          title: 'Total Vehículos',
          value: data.totalVehiculos.toString(),
          icon: 'fa-truck',
          color: 'bg-blue-500',
          change: `+${data.cambioVehiculos}%`,
          trend: 'up',
        },
        {
          title: 'Conductores Activos',
          value: data.conductoresActivos.toString(),
          icon: 'fa-user-tie',
          color: 'bg-green-500',
          change: `+${data.cambioConductores}%`,
          trend: 'up',
        },
        {
          title: 'Viajes Hoy',
          value: data.viajesHoy.toString(),
          icon: 'fa-route',
          color: 'bg-purple-500',
          change: `+${data.cambioViajes}%`,
          trend: 'up',
        },
        {
          title: 'Clientes',
          value: data.totalClientes.toString(),
          icon: 'fa-users',
          color: 'bg-orange-500',
          change: `+${data.cambioClientes}%`,
          trend: 'up',
        },
      ]);
    });
  }

  private loadVehiculosPorEstado() {
    return this.dashboardService.getVehiculosPorEstado().then((response) => {
      // Assuming response has a 'data' property which is the array, based on interface structure
      // Adjust if service returns the array directly.
      // Looking at service: return ... .then(response => response.data)
      // If response.data is VehiculosPorEstadoDto { data: [...] }, then here 'response' is that DTO.
      const data = response.data || [];

      const estadoMap: { [key: string]: { label: string; color: string } } = {
        activo: { label: 'Disponible', color: 'bg-green-500' },
        taller: { label: 'En Taller', color: 'bg-yellow-500' },
        retirado: { label: 'Retirado', color: 'bg-red-500' },
      };

      this.vehiculosPorEstado.set(
        data.map((item: VehiculosPorEstadoItemDto) => ({
          estado: estadoMap[item.estado]?.label || item.estado,
          cantidad: item.cantidad,
          color: estadoMap[item.estado]?.color || 'bg-gray-500',
          porcentaje: item.porcentaje,
        }))
      );
    });
  }

  private loadViajesRecientes() {
    return this.dashboardService.getViajesRecientes().then((response) => {
      const data = response.data || [];

      const estadoMap: { [key: string]: string } = {
        programado: 'text-yellow-500',
        en_progreso: 'text-blue-500',
        completado: 'text-green-500',
        cancelado: 'text-red-500',
      };

      const estadoLabelMap: { [key: string]: string } = {
        programado: 'Programado',
        en_progreso: 'En Progreso',
        completado: 'Completado',
        cancelado: 'Cancelado',
      };

      this.viajesRecientes.set(
        data.map((viaje: ViajeRecienteDto) => {
          const fecha = new Date(viaje.fechaSalida);
          return {
            id: viaje.id,
            ruta: viaje.ruta,
            conductor: viaje.conductor,
            vehiculo: viaje.vehiculo,
            estado: estadoLabelMap[viaje.estado] || viaje.estado,
            hora: fecha.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            color: estadoMap[viaje.estado] || 'text-gray-500',
          };
        })
      );
    });
  }

  private loadMantenimientosProximos() {
    return this.dashboardService.getMantenimientosProximos().then((response) => {
      this.mantenimientosProximos.set(response.data || []);
    });
  }

  private loadRutasPopulares() {
    return this.dashboardService.getRutasPopulares().then((response) => {
      this.rutasPopulares.set(response.data || []);
    });
  }

  private loadIngresosMensuales() {
    return this.dashboardService.getIngresosMensuales().then((response) => {
      this.ingresosMensuales.set(response.data || []);
    });
  }

  getPrioridadClass(prioridad: string): string {
    const classes: { [key: string]: string } = {
      alta: 'bg-red-100 text-red-600 border-red-200',
      media: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      baja: 'bg-green-100 text-green-600 border-green-200',
    };
    return classes[prioridad] || '';
  }

  getMaxIngreso(): number {
    const ingresos = this.ingresosMensuales();
    if (ingresos.length === 0) return 1;
    return Math.max(...ingresos.map((i) => i.monto));
  }

  getBarHeight(monto: number): number {
    const max = this.getMaxIngreso();
    return (monto / max) * 100;
  }
}
