import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role-guard';

export const homeRoutes: Routes = [

  {
    path: 'home',
    loadComponent: () =>
      import('../home/components/home/home')
        .then(m => m.HomeComponent)
  },

  {
    path: 'administracion/productos',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN','SELLER'] },
    loadChildren: () =>
      import('../administracion/productos/routers/productos-routes')
        .then(m => m.productosRoutes)
  },

  {
    path: 'administracion/ordenes',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN','CLIENT','SELLER'] },
    loadChildren: () =>
      import('../administracion/ordenes/routers/ordenes-routes')
        .then(m => m.ordenesRoutes)
  },

  {
    path: 'administracion/usuarios',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }, // VERIFICAR ROL
    loadChildren: () =>
      import('../administracion/usuarios/routers/usuarios-routes')
        .then(m => m.usuariosRoutes)
  },


  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
