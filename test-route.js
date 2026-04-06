const routeAccess = {
  'admin/dashboard': ['admin', 'empleado'],
  'admin/vehiculos': ['admin', 'empleado'],
  'admin/vehiculos/list': ['admin', 'empleado'],
  'admin/vehiculos/edit/:id': ['admin'],
  'admin/viajes': ['admin', 'empleado'],
  'admin/viajes/list': ['admin', 'empleado'],
  'admin/viajes/edit/:id': ['admin']
};

function canAccessRoute(route, roles) {
  let allowedRols = routeAccess[route];

  if (!allowedRols) {
    const rules = Object.entries(routeAccess);
    for (const [pathPattern, rolesConfig] of rules) {
      const regexStr = '^' + pathPattern.replace(/:[^\s/]+/g, '([^/]+)') + '$';
      const regex = new RegExp(regexStr);
      if (regex.test(route)) {
        console.log('Matched rule:', pathPattern);
        allowedRols = rolesConfig;
        break;
      }
    }
  }

  if (!allowedRols) {
     console.log('No rule matched for', route);
     return true;
  }
  return roles.some((role) => allowedRols.includes(role));
}

console.log('Test vehiculos:', canAccessRoute('admin/vehiculos/edit/123', ['empleado']));
console.log('Test proveedores:', canAccessRoute('admin/proveedores/edit/123', ['empleado']));
