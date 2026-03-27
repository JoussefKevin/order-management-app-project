import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router      = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 403:
          router.navigate(['/unauthorized']);
          break;
        case 404:
          console.warn('Recurso no encontrado:', req.url);
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
      }
      return throwError(() => error);
    })
  );
};
