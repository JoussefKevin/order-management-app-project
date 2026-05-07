import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth-interceptor';
import { TokenService } from '../auth/services/token';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let tokenSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    tokenSpy = jasmine.createSpyObj('TokenService', ['getAccessToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe agregar el header Authorization cuando hay token', () => {
    tokenSpy.getAccessToken.and.returnValue('mi-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mi-token');
    req.flush({});
  });

  it('no debe agregar el header Authorization cuando no hay token', () => {
    tokenSpy.getAccessToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
