import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { refreshTokenInterceptor } from './refresh-token-interceptor';
import { AuthService } from '../auth/services/auth';

describe('refreshTokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authSpy: { refreshToken: jasmine.Spy; logout: jasmine.Spy; isLoggedIn: jasmine.Spy };

  beforeEach(() => {
    authSpy = {
      refreshToken: jasmine.createSpy('refreshToken').and.returnValue(of({} as any)),
      logout:       jasmine.createSpy('logout'),
      isLoggedIn:   jasmine.createSpy('isLoggedIn').and.returnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([refreshTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock   = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe relanzar el error si no es 401', () => {
    let errorRecibido = false;
    httpClient.get('/api/test').subscribe({ error: () => (errorRecibido = true) });
    httpMock
      .expectOne('/api/test')
      .flush('Error', { status: 500, statusText: 'Server Error' });
    expect(errorRecibido).toBeTrue();
    expect(authSpy.refreshToken).not.toHaveBeenCalled();
  });

  it('no debe llamar refreshToken en 401 del endpoint de login', () => {
    let errorRecibido = false;
    httpClient.get('/auth/login').subscribe({ error: () => (errorRecibido = true) });
    httpMock
      .expectOne('/auth/login')
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(errorRecibido).toBeTrue();
    expect(authSpy.refreshToken).not.toHaveBeenCalled();
  });

  it('debe llamar refreshToken en error 401 de un endpoint protegido', () => {
    authSpy.refreshToken.and.returnValue(of({ jwt: 'new-token' } as any));

    httpClient.get('/api/recurso').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/recurso')
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    httpMock.expectOne('/api/recurso').flush({ data: 'ok' });

    expect(authSpy.refreshToken).toHaveBeenCalled();
  });

  it('debe llamar logout si el refreshToken falla', () => {
    authSpy.refreshToken.and.returnValue(throwError(() => new Error('refresh failed')));

    httpClient.get('/api/recurso').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/recurso')
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authSpy.logout).toHaveBeenCalled();
  });
});
