import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { errorHandlerInterceptor } from './error-handler-interceptor';
import { AuthService } from '../auth/services/auth';

describe('errorHandlerInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: { isLoggedIn: jasmine.Spy; logout: jasmine.Spy };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = {
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
      logout: jasmine.createSpy('logout'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorHandlerInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe navegar a /unauthorized en error 403', () => {
    httpClient.get('/api/test').subscribe({ error: () => {} });
    httpMock
      .expectOne('/api/test')
      .flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('debe relanzar el error en error 404', () => {
    let errorRecibido = false;
    httpClient.get('/api/test').subscribe({ error: () => (errorRecibido = true) });
    httpMock
      .expectOne('/api/test')
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
    expect(errorRecibido).toBeTrue();
  });

  it('debe relanzar el error en error 500', () => {
    let errorRecibido = false;
    httpClient.get('/api/test').subscribe({ error: () => (errorRecibido = true) });
    httpMock
      .expectOne('/api/test')
      .flush('Error', { status: 500, statusText: 'Internal Server Error' });
    expect(errorRecibido).toBeTrue();
  });

  it('debe relanzar otros errores sin navegación', () => {
    let errorRecibido = false;
    httpClient.get('/api/test').subscribe({ error: () => (errorRecibido = true) });
    httpMock
      .expectOne('/api/test')
      .flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    expect(errorRecibido).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
