import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { roleGuard } from './role-guard';
import { AuthService } from '../services/auth';

describe('roleGuard', () => {
  let authServiceMock: { userRole: jasmine.Spy };
  let routerMock: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => roleGuard(...params));

  const createRoute = (roles: string[]): ActivatedRouteSnapshot =>
    ({ data: { roles } }) as any;

  beforeEach(() => {
    authServiceMock = { userRole: jasmine.createSpy('userRole') };
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerMock.createUrlTree.and.returnValue({} as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('debe retornar true si el rol está permitido', () => {
    authServiceMock.userRole.and.returnValue('ADMIN');
    expect(executeGuard(createRoute(['ADMIN', 'SELLER']), {} as any)).toBeTrue();
  });

  it('debe redirigir a /unauthorized si el rol no está permitido', () => {
    authServiceMock.userRole.and.returnValue('CLIENT');
    executeGuard(createRoute(['ADMIN']), {} as any);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('debe redirigir a /unauthorized si no hay rol', () => {
    authServiceMock.userRole.and.returnValue(null);
    executeGuard(createRoute(['ADMIN']), {} as any);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
  });
});
