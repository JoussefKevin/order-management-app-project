import { Routes } from '@angular/router';

export const ordenesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/orden-home/orden-home')
        .then(m => m.OrdenHome),
    children: [

      {
        path: '',
        loadComponent: () =>
          import('../components/orden-listado/orden-listado')
            .then(m => m.OrdenListado)
      },

      {
        path: 'nuevo',
        loadComponent: () =>
          import('../components/orden-registro/orden-registro')
            .then(m => m.OrdenRegistroComponent)
      },

      {
        path: 'editar/:id',
        loadComponent: () =>
          import('../components/orden-registro/orden-registro')
            .then(m => m.OrdenRegistroComponent)
      },

      {
        path: 'detalle/:id',
        loadComponent: () =>
          import('../components/orden-detalle/orden-detalle')
            .then(m => m.OrdenDetalleComponent)
      }
    ]
  }
];
