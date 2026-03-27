import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService     = inject(AuthService);
  const router          = inject(Router);
  const rolesPermitidos = route.data['roles'] as string[];

  const rol = authService.userRole();

  if (rol && rolesPermitidos.includes(rol)) return true;

  return router.createUrlTree(['/unauthorized']);
};
