export interface DashboardStats {
  totalVehiculos: number;
  conductoresActivos: number;
  viajesHoy: number;
  totalClientes: number;
  cambioVehiculos: number;
  cambioConductores: number;
  cambioViajes: number;
  cambioClientes: number;
}

export interface VehiculoEstadoItem {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface VehiculosPorEstado {
  data: VehiculoEstadoItem[];
}

export interface ViajeReciente {
  id: number;
  ruta: string;
  conductor: string;
  vehiculo: string;
  estado: string;
  fechaSalida: string;
}

export interface ViajesRecientes {
  data: ViajeReciente[];
}

export interface MantenimientoProximo {
  vehiculo: string;
  tipo: string;
  fecha: string;
  dias: number;
  prioridad: string;
}

export interface MantenimientosProximos {
  data: MantenimientoProximo[];
}

export interface RutaPopular {
  nombre: string;
  viajes: number;
  porcentaje: number;
}

export interface RutasPopulares {
  data: RutaPopular[];
}

export interface IngresoMensual {
  mes: string;
  monto: number;
}

export interface IngresosMensuales {
  data: IngresoMensual[];
}
