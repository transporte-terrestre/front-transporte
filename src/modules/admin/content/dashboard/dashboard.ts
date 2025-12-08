import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@service/admin/dashboard.service';
import { ToastService } from '@service/toast.service';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  trend: 'up' | 'down';
}

interface VehiculoEstado {
  estado: string;
  cantidad: number;
  color: string;
  porcentaje: number;
}

interface ViajeConFormato {
  id: number;
  ruta: string;
  conductor: string;
  vehiculo: string;
  estado: string;
  hora: string;
  color: string;
}

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
  vehiculosPorEstado = signal<VehiculoEstado[]>([]);

  // Viajes recientes
  viajesRecientes = signal<ViajeConFormato[]>([]);

  // Mantenimientos próximos
  mantenimientosProximos = signal<any[]>([]);

  // Rutas más utilizadas
  rutasPopulares = signal<any[]>([]);

  // Ingresos mensuales
  ingresosMensuales = signal<any[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);

    // Cargar estadísticas generales
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set([
          {
            title: 'Total Vehículos',
            value: data.totalVehiculos.toString(),
            icon: 'fa-truck',
            color: 'bg-blue-500',
            change: `+${data.cambioVehiculos}%`,
            trend: 'up'
          },
          {
            title: 'Conductores Activos',
            value: data.conductoresActivos.toString(),
            icon: 'fa-user-tie',
            color: 'bg-green-500',
            change: `+${data.cambioConductores}%`,
            trend: 'up'
          },
          {
            title: 'Viajes Hoy',
            value: data.viajesHoy.toString(),
            icon: 'fa-route',
            color: 'bg-purple-500',
            change: `+${data.cambioViajes}%`,
            trend: 'up'
          },
          {
            title: 'Clientes',
            value: data.totalClientes.toString(),
            icon: 'fa-users',
            color: 'bg-orange-500',
            change: `+${data.cambioClientes}%`,
            trend: 'up'
          }
        ]);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.toastService.error('Error al cargar estadísticas');
      }
    });

    // Cargar vehículos por estado
    this.dashboardService.getVehiculosPorEstado().subscribe({
      next: (response) => {
        const estadoMap: { [key: string]: { label: string; color: string } } = {
          'activo': { label: 'Disponible', color: 'bg-green-500' },
          'taller': { label: 'En Taller', color: 'bg-yellow-500' },
          'retirado': { label: 'Retirado', color: 'bg-red-500' }
        };

        this.vehiculosPorEstado.set(
          response.data.map(item => ({
            estado: estadoMap[item.estado]?.label || item.estado,
            cantidad: item.cantidad,
            color: estadoMap[item.estado]?.color || 'bg-gray-500',
            porcentaje: item.porcentaje
          }))
        );
      },
      error: (error) => {
        console.error('Error al cargar vehículos por estado:', error);
        this.toastService.error('Error al cargar vehículos por estado');
      }
    });

    // Cargar viajes recientes
    this.dashboardService.getViajesRecientes().subscribe({
      next: (response) => {
        const estadoMap: { [key: string]: string } = {
          'programado': 'text-yellow-500',
          'en_progreso': 'text-blue-500',
          'completado': 'text-green-500',
          'cancelado': 'text-red-500'
        };

        const estadoLabelMap: { [key: string]: string } = {
          'programado': 'Programado',
          'en_progreso': 'En Progreso',
          'completado': 'Completado',
          'cancelado': 'Cancelado'
        };

        this.viajesRecientes.set(
          response.data.map(viaje => {
            const fecha = new Date(viaje.fechaSalida);
            return {
              id: viaje.id,
              ruta: viaje.ruta,
              conductor: viaje.conductor,
              vehiculo: viaje.vehiculo,
              estado: estadoLabelMap[viaje.estado] || viaje.estado,
              hora: fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
              color: estadoMap[viaje.estado] || 'text-gray-500'
            };
          })
        );
      },
      error: (error) => {
        console.error('Error al cargar viajes recientes:', error);
        this.toastService.error('Error al cargar viajes recientes');
      }
    });

    // Cargar mantenimientos próximos
    this.dashboardService.getMantenimientosProximos().subscribe({
      next: (response) => {
        this.mantenimientosProximos.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar mantenimientos próximos:', error);
        this.toastService.error('Error al cargar mantenimientos próximos');
      }
    });

    // Cargar rutas populares
    this.dashboardService.getRutasPopulares().subscribe({
      next: (response) => {
        this.rutasPopulares.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar rutas populares:', error);
        this.toastService.error('Error al cargar rutas populares');
      }
    });

    // Cargar ingresos mensuales
    this.dashboardService.getIngresosMensuales().subscribe({
      next: (response) => {
        this.ingresosMensuales.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ingresos mensuales:', error);
        this.toastService.error('Error al cargar ingresos mensuales');
        this.loading.set(false);
      }
    });
  }

  getPrioridadClass(prioridad: string): string {
    const classes: { [key: string]: string } = {
      'alta': 'bg-red-100 text-red-600 border-red-200',
      'media': 'bg-yellow-100 text-yellow-600 border-yellow-200',
      'baja': 'bg-green-100 text-green-600 border-green-200'
    };
    return classes[prioridad] || '';
  }

  getMaxIngreso(): number {
    const ingresos = this.ingresosMensuales();
    if (ingresos.length === 0) return 1;
    return Math.max(...ingresos.map(i => i.monto));
  }

  getBarHeight(monto: number): number {
    const max = this.getMaxIngreso();
    return (monto / max) * 100;
  }
}
