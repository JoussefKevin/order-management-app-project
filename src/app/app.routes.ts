import { Routes } from '@angular/router';
import { noAuthGuard } from './core/auth/guards/no-auth-guard';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./core/auth/components/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/routers/home-routes')
        .then(m => m.homeRoutes)
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized')
        .then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found')
        .then(m => m.NotFoundComponent)
  }
];
