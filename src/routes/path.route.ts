import { ApiField } from 'api/backend.api';

type Rol = ApiField<'usuarios', 'findOne', 'roles'>[number];

export type PathNode = {
  _path: string;
  [key: string]: any;
};

export function buildPath(node: PathNode): string {
  const findFullPath = (obj: any, target: PathNode, path: string[] = []): string[] | null => {
    if (!obj || typeof obj !== 'object') return null;

    if (obj === target) {
      return path;
    }

    for (const key in obj) {
      if (key === '_path') continue;

      const value = obj[key];
      const nextPath =
        '_path' in obj && typeof obj._path === 'string' ? [...path, obj._path] : path;

      const result = findFullPath(value, target, nextPath);
      if (result) return result;
    }

    return null;
  };

  const fullPath = findFullPath(PATH, node);

  if (!fullPath) {
    return node._path ?? '';
  }

  return [...fullPath, node._path].filter(Boolean).join('/');
}

export function getPath(node: PathNode): string {
  return node._path;
}

export const PATH = {
  auth: {
    _path: 'auth',
    signIn: { _path: 'sign-in' },
    signUp: { _path: 'sign-up' },
  },
  admin: {
    _path: 'admin',
    dashboard: {
      _path: 'dashboard',
    },
    conductores: {
      _path: 'conductores',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    vehiculos: {
      _path: 'vehiculos',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
      lineas: {
        _path: 'lineas',
      },
    },
    mantenimientos: {
      _path: 'mantenimientos',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
      tareas: { _path: 'tareas' },
    },
    rutas: {
      _path: 'rutas',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    viajes: {
      _path: 'viajes',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    usuarios: {
      _path: 'usuarios',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    clientes: {
      _path: 'clientes',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },

    proveedores: {
      _path: 'proveedores',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    propietarios: {
      _path: 'propietarios',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    talleres: {
      _path: 'talleres',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    alquileres: {
      _path: 'alquileres',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    reportes: {
      _path: 'reportes',
    },
    historial: {
      _path: 'historial',
      list: { _path: 'list' },
    },
  },
  error: {
    _path: 'error',
    unauthorized: { _path: 'unauthorized' },
  },
} as const;

export const ROUTE_CONFIG = {
  // Rutas por defecto según el nivel
  defaultRoutes: {
    admin: buildPath(PATH.admin.dashboard),
    empleado: buildPath(PATH.admin.dashboard),
  } as Record<Rol, string>,

  routeAccess: {
    // Dashboard - Todos pueden acceder
    [buildPath(PATH.admin.dashboard)]: ['admin', 'empleado'],

    // Conductores
    [buildPath(PATH.admin.conductores)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.conductores.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.conductores.edit)]: ['admin'],

    // Vehículos
    [buildPath(PATH.admin.vehiculos)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.vehiculos.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.vehiculos.edit)]: ['admin'],
    [buildPath(PATH.admin.vehiculos.lineas)]: ['admin'],

    // Mantenimientos
    [buildPath(PATH.admin.mantenimientos)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.mantenimientos.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.mantenimientos.edit)]: ['admin'],
    [buildPath(PATH.admin.mantenimientos.tareas)]: ['admin'],

    // Rutas
    [buildPath(PATH.admin.rutas)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.rutas.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.rutas.edit)]: ['admin'],

    // Viajes
    [buildPath(PATH.admin.viajes)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.viajes.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.viajes.edit)]: ['admin'],

    // Usuarios
    [buildPath(PATH.admin.usuarios)]: ['admin'],
    [buildPath(PATH.admin.usuarios.list)]: ['admin'],
    [buildPath(PATH.admin.usuarios.edit)]: ['admin'],

    // Clientes
    [buildPath(PATH.admin.clientes)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.clientes.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.clientes.edit)]: ['admin'],

    // Proveedores
    [buildPath(PATH.admin.proveedores)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.proveedores.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.proveedores.edit)]: ['admin'],

    // Propietarios
    [buildPath(PATH.admin.propietarios)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.propietarios.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.propietarios.edit)]: ['admin'],

    // Talleres
    [buildPath(PATH.admin.talleres)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.talleres.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.talleres.edit)]: ['admin'],

    // Alquileres
    [buildPath(PATH.admin.alquileres)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.alquileres.list)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.alquileres.edit)]: ['admin'],

    // Reportes
    [buildPath(PATH.admin.reportes)]: ['admin', 'empleado'],

    // Historial
    [buildPath(PATH.admin.historial)]: ['admin'],
    [buildPath(PATH.admin.historial.list)]: ['admin'],

    // Errors
    [buildPath(PATH.error.unauthorized)]: ['admin', 'empleado'],
  } as Record<string, Rol[]>,
};

export function canAccessRoute(route: string, roles: Rol[]): boolean {
  let allowedRols = ROUTE_CONFIG.routeAccess[route];

  if (!allowedRols) {
    const rules = Object.entries(ROUTE_CONFIG.routeAccess);
    for (const [pathPattern, rolesConfig] of rules) {
      const regexStr = '^' + pathPattern.replace(/:[^\s/]+/g, '([^/]+)') + '$';
      const regex = new RegExp(regexStr);
      if (regex.test(route)) {
        allowedRols = rolesConfig;
        break;
      }
    }
  }

  if (!allowedRols) return true;
  return roles.some((role) => allowedRols.includes(role));
}

export function getDefaultRoute(roles: Rol[]): string {
  const role = roles[0];
  return ROUTE_CONFIG.defaultRoutes[role] || buildPath(PATH.admin.dashboard);
}
