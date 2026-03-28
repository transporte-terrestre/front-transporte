import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '@service/admin/dashboard.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';

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

interface MantenimientoProximoVM extends MantenimientoProximoDto {
  estado: string;
}
interface RutaPopularVM extends RutaPopularDto {}
interface IngresoMensualVM extends IngresoMensualDto {}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private toastService = inject(ToastService);

  viajesListPath = '/' + buildPath(PATH.admin.viajes.list);
  mantenimientosListPath = '/' + buildPath(PATH.admin.mantenimientos.list);

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

  // Kilometraje mensual
  kilometrajeMensual = signal<IngresoMensualVM[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);

    Promise.all([
      this.loadStats(),
      this.loadVehiculosPorEstado(),
      this.loadViajesRecientes(),
      this.loadMantenimientosProximos(),
      this.loadRutasPopulares(),
      this.loadKilometrajeMensual(),
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
          value: data?.totalVehiculos?.toString(),
          icon: 'fa-truck',
          color: 'bg-blue-500',
        },
        {
          title: 'Conductores Activos',
          value: data?.conductoresActivos?.toString(),
          icon: 'fa-user-tie',
          color: 'bg-green-500',
        },
        {
          title: 'Viajes Hoy',
          value: data?.viajesHoy?.toString(),
          icon: 'fa-route',
          color: 'bg-purple-500',
        },
        {
          title: 'Clientes',
          value: data?.totalClientes?.toString(),
          icon: 'fa-users',
          color: 'bg-orange-500',
        },
      ]);
    });
  }

  private loadVehiculosPorEstado() {
    return this.dashboardService.getVehiculosPorEstado().then((response) => {
      const data = response.data || [];

      const estadoMap: { [key: string]: { label: string; color: string } } = {
        disponible: { label: 'Disponible', color: 'bg-green-500' },
        circulacion: { label: 'En Circulación', color: 'bg-blue-500' },
        taller: { label: 'En Taller', color: 'bg-yellow-500' },
        retirado: { label: 'Retirado', color: 'bg-red-500' },
        alquilado: { label: 'Alquilado', color: 'bg-purple-500' },
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
      this.mantenimientosProximos.set((response.data as any) || []);
    });
  }

  private loadKilometrajeMensual() {
    return this.dashboardService.getIngresosMensuales().then((response) => {
      this.kilometrajeMensual.set(response.data || []);
    });
  }

  private loadRutasPopulares() {
    return this.dashboardService.getRutasPopulares().then((response) => {
      this.rutasPopulares.set(response.data || []);
    });
  }

  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      pendiente: 'bg-info/10 text-info border-info/20',
      en_proceso: 'bg-warning/10 text-warning border-warning/20',
      finalizado: 'bg-success/10 text-success border-success/20',
    };
    return classes[estado] || 'bg-text/10 text-text/60 border-text/10';
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      finalizado: 'Finalizado',
    };
    return labels[estado] || estado;
  }

  getPrioridadClass(prioridad: string): string {
    const classes: { [key: string]: string } = {
      alta: 'bg-red-100 text-red-600 border-red-200',
      media: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      baja: 'bg-green-100 text-green-600 border-green-200',
    };
    return classes[prioridad] || '';
  }

  getMaxKilometraje(): number {
    const data = this.kilometrajeMensual();
    if (data.length === 0) return 1;
    return Math.max(...data.map((i) => i.monto));
  }

  getBarHeight(monto: number): number {
    const max = this.getMaxKilometraje();
    return (monto / max) * 100;
  }
}
