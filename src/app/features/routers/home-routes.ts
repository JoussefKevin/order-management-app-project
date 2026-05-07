import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role-guard';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../home/components/home/home')
        .then(m => m.HomeComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/components/home/home')
            .then(m => m.HomeBienvenidaComponent)
      },
      {
        path: 'administracion/productos',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'SELLER'] },
        loadChildren: () =>
          import('../administracion/productos/routers/productos-routes')
            .then(m => m.productosRoutes)
      },

      {
        path: 'administracion/usuarios',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () =>
          import('../administracion/usuarios/routers/usuarios-routes')
            .then(m => m.usuariosRoutes)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
