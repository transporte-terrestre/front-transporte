import { UsuarioPaginationParams } from '@interface/admin/usuario.interface';
import { VehiculoPaginationParams } from '@interface/admin/vehiculo.interface';
import { ConductorPaginationParams } from '@interface/admin/conductor.interface';
import { MantenimientoPaginationParams } from '@interface/admin/mantenimiento.interface';
import { RutaPaginationParams } from '@interface/admin/ruta.interface';
import { ViajePaginationParams } from '@interface/admin/viaje.interface';
import { ClientePaginationParams } from '@interface/admin/cliente.interface';
import { TallerPaginationParams } from '@interface/admin/taller.interface';
import { NotificacionPaginationParams } from '@interface/admin/notificacion.interface';
import { ReporteQueryDto } from '@interface/admin/reportes.interface';

const BASE_URL_LOCAL = 'http://localhost:3000';
const BASE_URL_GLOBAL = 'https://transporte-terrestre.onrender.com';

const BASE_URL = BASE_URL_LOCAL;

const buildQueryString = (params?: any): string => {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      query.append(key, params[key]!.toString());
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const API_URL = {
  auth: {
    login: `${BASE_URL}/auth/login`,
  },
  usuarios: {
    findAll: (params?: UsuarioPaginationParams) =>
      `${BASE_URL}/usuario/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/usuario/find-one/${id}`,
    create: `${BASE_URL}/usuario/create`,
    update: (id: number) => `${BASE_URL}/usuario/update/${id}`,
    delete: (id: number) => `${BASE_URL}/usuario/delete/${id}`,
    documentos: {
      find: (id: number) => `${BASE_URL}/usuario/documento/${id}`,
      create: `${BASE_URL}/usuario/documento/create`,
      update: (id: number) => `${BASE_URL}/usuario/documento/update/${id}`,
      delete: (id: number) => `${BASE_URL}/usuario/documento/delete/${id}`,
    },
  },
  vehiculos: {
    findAll: (params?: VehiculoPaginationParams) =>
      `${BASE_URL}/vehiculo/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/vehiculo/find-one/${id}`,
    create: `${BASE_URL}/vehiculo/create`,
    update: (id: number) => `${BASE_URL}/vehiculo/update/${id}`,
    delete: (id: number) => `${BASE_URL}/vehiculo/delete/${id}`,
    documentos: {
      find: (id: number) => `${BASE_URL}/vehiculo/documento/${id}`,
      create: `${BASE_URL}/vehiculo/documento/create`,
      update: (id: number) => `${BASE_URL}/vehiculo/documento/update/${id}`,
      delete: (id: number) => `${BASE_URL}/vehiculo/documento/delete/${id}`,
    },
  },
  conductores: {
    findAll: (params?: ConductorPaginationParams) =>
      `${BASE_URL}/conductor/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/conductor/find-one/${id}`,
    create: `${BASE_URL}/conductor/create`,
    update: (id: number) => `${BASE_URL}/conductor/update/${id}`,
    delete: (id: number) => `${BASE_URL}/conductor/delete/${id}`,
    documentos: {
      find: (id: number) => `${BASE_URL}/conductor/documento/${id}`,
      create: `${BASE_URL}/conductor/documento/create`,
      update: (id: number) => `${BASE_URL}/conductor/documento/update/${id}`,
      delete: (id: number) => `${BASE_URL}/conductor/documento/delete/${id}`,
    },
  },
  mantenimientos: {
    findAll: (params?: MantenimientoPaginationParams) =>
      `${BASE_URL}/mantenimiento/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/mantenimiento/find-one/${id}`,
    create: `${BASE_URL}/mantenimiento/create`,
    update: (id: number) => `${BASE_URL}/mantenimiento/update/${id}`,
    delete: (id: number) => `${BASE_URL}/mantenimiento/delete/${id}`,
  },
  rutas: {
    findAll: (params?: RutaPaginationParams) =>
      `${BASE_URL}/ruta/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/ruta/find-one/${id}`,
    create: `${BASE_URL}/ruta/create`,
    update: (id: number) => `${BASE_URL}/ruta/update/${id}`,
    delete: (id: number) => `${BASE_URL}/ruta/delete/${id}`,
  },
  viajes: {
    findAll: (params?: ViajePaginationParams) =>
      `${BASE_URL}/viaje/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/viaje/find-one/${id}`,
    create: `${BASE_URL}/viaje/create`,
    update: (id: number) => `${BASE_URL}/viaje/update/${id}`,
    delete: (id: number) => `${BASE_URL}/viaje/delete/${id}`,
    conductores: {
      findAll: (viajeId: number) => `${BASE_URL}/viaje/${viajeId}/conductores`,
      findOne: (viajeId: number, conductorId: number) =>
        `${BASE_URL}/viaje/${viajeId}/conductor/${conductorId}`,
      assign: `${BASE_URL}/viaje/conductor/assign`,
      update: (viajeId: number, conductorId: number) =>
        `${BASE_URL}/viaje/${viajeId}/conductor/${conductorId}`, // PATCH
      delete: (viajeId: number, conductorId: number) =>
        `${BASE_URL}/viaje/${viajeId}/conductor/${conductorId}`, // DELETE
    },
    vehiculos: {
      findAll: (viajeId: number) => `${BASE_URL}/viaje/${viajeId}/vehiculos`,
      findOne: (viajeId: number, vehiculoId: number) =>
        `${BASE_URL}/viaje/${viajeId}/vehiculo/${vehiculoId}`,
      assign: `${BASE_URL}/viaje/vehiculo/assign`,
      update: (viajeId: number, vehiculoId: number) =>
        `${BASE_URL}/viaje/${viajeId}/vehiculo/${vehiculoId}`, // PATCH
      delete: (viajeId: number, vehiculoId: number) =>
        `${BASE_URL}/viaje/${viajeId}/vehiculo/${vehiculoId}`, // DELETE
    },
    comentarios: {
      findAll: (viajeId: number) => `${BASE_URL}/viaje/${viajeId}/comentarios`,
      find: (id: number) => `${BASE_URL}/viaje/comentario/${id}`,
      create: `${BASE_URL}/viaje/comentario/create`,
      update: (id: number) => `${BASE_URL}/viaje/comentario/update/${id}`,
      delete: (id: number) => `${BASE_URL}/viaje/comentario/delete/${id}`,
    },
  },
  clientes: {
    findAll: (params?: ClientePaginationParams) =>
      `${BASE_URL}/cliente/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/cliente/find-one/${id}`,
    create: `${BASE_URL}/cliente/create`,
    update: (id: number) => `${BASE_URL}/cliente/update/${id}`,
    delete: (id: number) => `${BASE_URL}/cliente/delete/${id}`,
    documentos: {
      find: (id: number) => `${BASE_URL}/cliente/documento/${id}`,
      create: `${BASE_URL}/cliente/documento/create`,
      update: (id: number) => `${BASE_URL}/cliente/documento/update/${id}`,
      delete: (id: number) => `${BASE_URL}/cliente/documento/delete/${id}`,
    },
  },
  talleres: {
    findAll: (params?: TallerPaginationParams) =>
      `${BASE_URL}/taller/find-all${buildQueryString(params)}`,
    findOne: (id: number) => `${BASE_URL}/taller/find-one/${id}`,
    create: `${BASE_URL}/taller/create`,
    update: (id: number) => `${BASE_URL}/taller/update/${id}`,
    delete: (id: number) => `${BASE_URL}/taller/delete/${id}`,
  },
  notificaciones: {
    findAll: (params?: NotificacionPaginationParams) =>
      `${BASE_URL}/notificacion/find-all${buildQueryString(params)}`,
    create: `${BASE_URL}/notificacion/create`,
    leido: (id: number, userId: number) => `${BASE_URL}/notificacion/leido/${id}?userId=${userId}`,
  },
  dashboard: {
    stats: `${BASE_URL}/dashboard/stats`,
    vehiculosEstado: `${BASE_URL}/dashboard/vehiculos-estado`,
    viajesRecientes: `${BASE_URL}/dashboard/viajes-recientes`,
    mantenimientosProximos: `${BASE_URL}/dashboard/mantenimientos-proximos`,
    rutasPopulares: `${BASE_URL}/dashboard/rutas-populares`,
    ingresosMensuales: `${BASE_URL}/dashboard/ingresos-mensuales`,
  },
  storage: {
    upload: (params?: { folder?: string }) => {
      const query = new URLSearchParams();
      if (params?.folder) query.append('folder', params.folder);
      return `${BASE_URL}/storage?${query.toString()}`;
    },
    delete: (publicId: string) => `${BASE_URL}/storage/${encodeURIComponent(publicId)}`,
  },
  reportes: {
    viajesVehiculo: (params?: ReporteQueryDto) =>
      `${BASE_URL}/reportes/viajes-vehiculo${buildQueryString(params)}`,
    viajesConductor: (params?: ReporteQueryDto) =>
      `${BASE_URL}/reportes/viajes-conductor${buildQueryString(params)}`,
    kilometrajeVehiculo: (params?: ReporteQueryDto) =>
      `${BASE_URL}/reportes/kilometraje-vehiculo${buildQueryString(params)}`,
    // Detailed reports
    viajesDetalladosVehiculo: (id: number, params?: ReporteQueryDto) =>
      `${BASE_URL}/reportes/viajes-detallados/vehiculo/${id}${buildQueryString(params)}`,
    viajesDetalladosConductor: (id: number, params?: ReporteQueryDto) =>
      `${BASE_URL}/reportes/viajes-detallados/conductor/${id}${buildQueryString(params)}`,
    viajesDetalladosCliente: (id: number, params?: ReporteQueryDto) =>
      `${BASE_URL}/reportes/viajes-detallados/cliente/${id}${buildQueryString(params)}`,
  },
};
