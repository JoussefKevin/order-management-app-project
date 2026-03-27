import { Routes } from '@angular/router';
import { roleGuard } from '../../../../core/auth/guards/role-guard';

export const usuariosRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },//VERIFICAR ROLE
    loadComponent: () =>
      import('../components/usuario-home/usuario-home')
        .then(m => m.UsuarioHome),
    children: [

      {
        path: '',
        loadComponent: () =>
          import('../components/usuario-listado/usuario-listado')
            .then(m => m.UsuarioListadoComponent)
      },


      {
        path: 'nuevo',
        loadComponent: () =>
          import('../components/usuario-registro/usuario-registro')
            .then(m => m.UsuarioRegistro)
      }
    ]
  }
];
