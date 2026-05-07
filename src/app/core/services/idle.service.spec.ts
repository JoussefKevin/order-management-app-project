import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IdleService } from './idle';
import { AuthService } from '../auth/services/auth';

describe('IdleService', () => {
  let service: IdleService;
  let authSpy: { isLoggedIn: jasmine.Spy; logout: jasmine.Spy };
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = {
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
      logout: jasmine.createSpy('logout'),
    };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        IdleService,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(IdleService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('isIdle debe ser false inicialmente', () => {
    expect(service.isIdle()).toBeFalse();
  });

  it('startWatching debe poder llamarse sin errores', () => {
    expect(() => service.startWatching()).not.toThrow();
    service.stopWatching();
  });

  it('stopWatching debe poder llamarse sin errores', () => {
    expect(() => service.stopWatching()).not.toThrow();
  });

  it('stopWatching después de startWatching no debe lanzar error', () => {
    service.startWatching();
    expect(() => service.stopWatching()).not.toThrow();
  });

  it('startWatching llamado dos veces cubre resetTimer cuando el timer ya existe', () => {
    service.startWatching();
    service.startWatching();
    expect(() => service.stopWatching()).not.toThrow();
  });
});
