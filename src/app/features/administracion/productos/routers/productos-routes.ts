import { Routes } from '@angular/router';

export const productosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/producto-home/producto-home')
        .then(m => m.ProductoHomeComponent),
    children: [

      {
        path: '',
        loadComponent: () =>
          import('../components/producto-listado/producto-listado')
            .then(m => m.ProductoListadoComponent)
      },

      {
        path: 'nuevo',
        loadComponent: () =>
          import('../components/producto-registro/producto-registro')
            .then(m => m.ProductoRegistroComponent)
      },

      {
        path: 'editar/:id',
        loadComponent: () =>
          import('../components/producto-registro/producto-registro')
            .then(m => m.ProductoRegistroComponent)
      }
    ]
  }
];
