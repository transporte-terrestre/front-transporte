import { Rol } from '@interface/admin/usuario.interface';

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
    talleres: {
      _path: 'talleres',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    reportes: {
      _path: 'reportes',
    },
  },
} as const;

export const ROUTE_CONFIG = {
  // Rutas por defecto según el nivel
  defaultRoutes: {
    admin: buildPath(PATH.admin.dashboard),
    empleado: buildPath(PATH.admin.dashboard),
  } as Record<Rol, string>,

  // Control de acceso a rutas
  routeAccess: {
    // Dashboard - Todos pueden acceder
    [buildPath(PATH.admin.dashboard)]: ['admin', 'empleado'],

    // Conductores - admins
    [buildPath(PATH.admin.conductores)]: ['admin'],
    [buildPath(PATH.admin.conductores.edit)]: ['admin'],

    // Vehículos - admins y empleados
    [buildPath(PATH.admin.vehiculos)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.vehiculos.edit)]: ['admin', 'empleado'],

    // Otras rutas
    [buildPath(PATH.admin.mantenimientos)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.rutas)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.viajes)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.usuarios)]: ['admin'],
    [buildPath(PATH.admin.clientes)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.talleres)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.talleres.edit)]: ['admin', 'empleado'],
    [buildPath(PATH.admin.reportes)]: ['admin', 'empleado'],
  } as Record<string, Rol[]>,
};

export function canAccessRoute(route: string, roles: Rol[]): boolean {
  const allowedRols = ROUTE_CONFIG.routeAccess[route];
  if (!allowedRols) return true;
  return roles.some((role) => allowedRols.includes(role));
}

export function getDefaultRoute(roles: Rol[]): string {
  const role = roles[0];
  return ROUTE_CONFIG.defaultRoutes[role] || buildPath(PATH.admin.dashboard);
}
