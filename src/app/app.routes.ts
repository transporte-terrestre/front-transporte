import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth/auth.guard';
import { PATH, getPath } from '@route/path.route';

export const routes: Routes = [
  {
    path: getPath(PATH.admin),
    loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    children: [
      {
        path: getPath(PATH.admin.dashboard),
        loadComponent: () =>
          import('@module/admin/content/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: getPath(PATH.admin.conductores),
        loadComponent: () =>
          import('@module/admin/content/conductores/conductores').then((m) => m.Conductores),
        children: [
          {
            path: getPath(PATH.admin.conductores.list),
            loadComponent: () =>
              import(
                '@module/admin/content/conductores/content/conductores-list/conductores-list'
              ).then((m) => m.ConductoresList),
          },
          {
            path: getPath(PATH.admin.conductores.edit),
            loadComponent: () =>
              import(
                '@module/admin/content/conductores/content/conductores-edit/conductores-edit'
              ).then((m) => m.ConductoresEdit),
          },
          { path: '**', redirectTo: getPath(PATH.admin.conductores.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.vehiculos),
        loadComponent: () =>
          import('@module/admin/content/vehiculos/vehiculos').then((m) => m.Vehiculos),
        children: [
          {
            path: getPath(PATH.admin.vehiculos.list),
            loadComponent: () =>
              import('@module/admin/content/vehiculos/content/vehiculos-list/vehiculos-list').then(
                (m) => m.VehiculosList
              ),
          },
          {
            path: getPath(PATH.admin.vehiculos.edit),
            loadComponent: () =>
              import('@module/admin/content/vehiculos/content/vehiculos-edit/vehiculos-edit').then(
                (m) => m.VehiculosEdit
              ),
          },
          {
            path: getPath(PATH.admin.vehiculos.lineas),
            loadComponent: () =>
              import(
                '@module/admin/content/vehiculos/content/vehiculos-lineas/vehiculos-lineas'
              ).then((m) => m.VehiculosLineas),
          },
          { path: '**', redirectTo: getPath(PATH.admin.vehiculos.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.mantenimientos),
        loadComponent: () =>
          import('@module/admin/content/mantenimientos/mantenimientos').then(
            (m) => m.Mantenimientos
          ),
        children: [
          {
            path: getPath(PATH.admin.mantenimientos.list),
            loadComponent: () =>
              import(
                '@module/admin/content/mantenimientos/content/mantenimientos-list/mantenimientos-list'
              ).then((m) => m.MantenimientosList),
          },
          {
            path: getPath(PATH.admin.mantenimientos.edit),
            loadComponent: () =>
              import(
                '@module/admin/content/mantenimientos/content/mantenimientos-edit/mantenimientos-edit'
              ).then((m) => m.MantenimientosEdit),
          },
          {
            path: getPath(PATH.admin.mantenimientos.tareas),
            loadComponent: () =>
              import(
                '@module/admin/content/mantenimientos/content/mantenimientos-tareas/mantenimientos-tareas'
              ).then((m) => m.MantenimientosTareas),
          },
          { path: '**', redirectTo: getPath(PATH.admin.mantenimientos.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.rutas),
        loadComponent: () => import('@module/admin/content/rutas/rutas').then((m) => m.Rutas),
        children: [
          {
            path: getPath(PATH.admin.rutas.list),
            loadComponent: () =>
              import('@module/admin/content/rutas/content/rutas-list/rutas-list').then(
                (m) => m.RutasList
              ),
          },
          {
            path: getPath(PATH.admin.rutas.edit),
            loadComponent: () =>
              import('@module/admin/content/rutas/content/rutas-edit/rutas-edit').then(
                (m) => m.RutasEdit
              ),
          },
          { path: '**', redirectTo: getPath(PATH.admin.rutas.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.viajes),
        loadComponent: () => import('@module/admin/content/viajes/viajes').then((m) => m.Viajes),
        children: [
          {
            path: getPath(PATH.admin.viajes.list),
            loadComponent: () =>
              import('@module/admin/content/viajes/content/viajes-list/viajes-list').then(
                (m) => m.ViajesList
              ),
          },
          {
            path: getPath(PATH.admin.viajes.edit),
            loadComponent: () =>
              import('@module/admin/content/viajes/content/viajes-edit/viajes-edit').then(
                (m) => m.ViajesEdit
              ),
          },
          { path: '**', redirectTo: getPath(PATH.admin.viajes.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.usuarios),
        loadComponent: () =>
          import('@module/admin/content/usuarios/usuarios').then((m) => m.Usuarios),
        children: [
          {
            path: getPath(PATH.admin.usuarios.list),
            loadComponent: () =>
              import('@module/admin/content/usuarios/content/usuarios-list/usuarios-list').then(
                (m) => m.UsuariosList
              ),
          },
          {
            path: getPath(PATH.admin.usuarios.edit),
            loadComponent: () =>
              import('@module/admin/content/usuarios/content/usuarios-edit/usuarios-edit').then(
                (m) => m.UsuariosEdit
              ),
          },
          { path: '**', redirectTo: getPath(PATH.admin.usuarios.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.clientes),
        loadComponent: () =>
          import('@module/admin/content/clientes/clientes').then((m) => m.Clientes),
        children: [
          {
            path: getPath(PATH.admin.clientes.list),
            loadComponent: () =>
              import('@module/admin/content/clientes/content/clientes-list/clientes-list').then(
                (m) => m.ClientesList
              ),
          },
          {
            path: getPath(PATH.admin.clientes.edit),
            loadComponent: () =>
              import('@module/admin/content/clientes/content/clientes-edit/clientes-edit').then(
                (m) => m.ClientesEdit
              ),
          },
          { path: '**', redirectTo: getPath(PATH.admin.clientes.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.propietarios),
        loadComponent: () =>
          import('@module/admin/content/propietarios/propietarios').then((m) => m.Propietarios),
        children: [
          {
            path: getPath(PATH.admin.propietarios.list),
            loadComponent: () =>
              import(
                '@module/admin/content/propietarios/content/propietarios-list/propietarios-list'
              ).then((m) => m.PropietariosList),
          },
          {
            path: getPath(PATH.admin.propietarios.edit),
            loadComponent: () =>
              import(
                '@module/admin/content/propietarios/content/propietarios-edit/propietarios-edit'
              ).then((m) => m.PropietariosEdit),
          },
          { path: '**', redirectTo: getPath(PATH.admin.propietarios.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.talleres),
        loadComponent: () =>
          import('@module/admin/content/talleres/talleres').then((m) => m.Talleres),
        children: [
          {
            path: getPath(PATH.admin.talleres.list),
            loadComponent: () =>
              import('@module/admin/content/talleres/content/talleres-list/talleres-list').then(
                (m) => m.TalleresList
              ),
          },
          {
            path: getPath(PATH.admin.talleres.edit),
            loadComponent: () =>
              import('@module/admin/content/talleres/content/talleres-edit/talleres-edit').then(
                (m) => m.TalleresEdit
              ),
          },
          { path: '**', redirectTo: getPath(PATH.admin.talleres.list), pathMatch: 'full' },
        ],
      },
      {
        path: getPath(PATH.admin.reportes),
        loadComponent: () =>
          import('@module/admin/content/reportes/reportes').then((m) => m.Reportes),
      },
      { path: '**', redirectTo: getPath(PATH.admin.dashboard), pathMatch: 'full' },
    ],
  },
  {
    path: getPath(PATH.auth),
    children: [
      {
        path: getPath(PATH.auth.signIn),
        loadComponent: () => import('@module/auth/sing-in/sing-in').then((m) => m.SingIn),
      },
      {
        path: getPath(PATH.auth.signUp),
        loadComponent: () => import('@module/auth/sing-up/sing-up').then((m) => m.SingUp),
      },
      { path: '**', redirectTo: getPath(PATH.auth.signIn), pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: getPath(PATH.admin), pathMatch: 'full' },
];
