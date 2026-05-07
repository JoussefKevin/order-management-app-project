import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { noAuthGuard } from './no-auth-guard';
import { AuthService } from '../services/auth';

describe('noAuthGuard', () => {
  let authServiceMock: { isLoggedIn: jasmine.Spy };
  let routerMock: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => noAuthGuard(...params));

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

  it('debe retornar true si el usuario NO está autenticado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);
    expect(executeGuard({} as any, {} as any)).toBeTrue();
  });

  it('debe redirigir a /home si ya está autenticado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    executeGuard({} as any, {} as any);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/home']);
  });
});
