import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth';

describe('authGuard', () => {
  let authServiceMock: { isLoggedIn: jasmine.Spy };
  let routerMock: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => authGuard(...params));

  beforeEach(() => {
    authServiceMock = { isLoggedIn: jasmine.createSpy('isLoggedIn') };
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerMock.createUrlTree.and.returnValue({} as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('debe retornar true si el usuario está autenticado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    expect(executeGuard({} as any, {} as any)).toBeTrue();
  });

  it('debe redirigir a /login si no está autenticado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);
    executeGuard({} as any, {} as any);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
