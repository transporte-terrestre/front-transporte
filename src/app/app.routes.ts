import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth/auth.guard';
import { PATH, getPath } from '@route/path.route';

export const routes: Routes = [
  {
    path: getPath(PATH.admin), loadComponent: () => import('@module/admin/admin').then(m => m.Admin), canActivate: [authGuard],
    children: [
      { path: getPath(PATH.admin.dashboard), loadComponent: () => import('@module/admin/content/dashboard/dashboard').then(m => m.Dashboard)},
      { path: getPath(PATH.admin.conductores), loadComponent: () => import('@module/admin/content/conductores/conductores').then(m => m.Conductores) },
      { path: getPath(PATH.admin.vehiculos), loadComponent: () => import('@module/admin/content/vehiculos/vehiculos').then(m => m.Vehiculos) },
      { path: getPath(PATH.admin.mantenimientos), loadComponent: () => import('@module/admin/content/mantenimientos/mantenimientos').then(m => m.Mantenimientos) },
      { path: getPath(PATH.admin.rutas), loadComponent: () => import('@module/admin/content/rutas/rutas').then(m => m.Rutas) },
      { path: getPath(PATH.admin.viajes), loadComponent: () => import('@module/admin/content/viajes/viajes').then(m => m.Viajes) },
      { path: getPath(PATH.admin.usuarios), loadComponent: () => import('@module/admin/content/usuarios/usuarios').then(m => m.Usuarios) },
      { path: getPath(PATH.admin.clientes), loadComponent: () => import('@module/admin/content/clientes/clientes').then(m => m.Clientes) },
      { path: '**', redirectTo: getPath(PATH.admin.dashboard), pathMatch: 'full' },
    ]
  },
  { path: getPath(PATH.auth),
    children: [
      { path: getPath(PATH.auth.signIn), loadComponent: () => import('@module/auth/sing-in/sing-in').then(m => m.SingIn) },
      { path: getPath(PATH.auth.signUp), loadComponent: () => import('@module/auth/sing-up/sing-up').then(m => m.SingUp) },
      { path: '**', redirectTo: getPath(PATH.auth.signIn), pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: getPath(PATH.admin), pathMatch: 'full' },
];
