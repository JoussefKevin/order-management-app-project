import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './auth';
import { TokenService } from './token';
import { environment } from '../../../../environments/environment';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenSpy: jasmine.SpyObj<TokenService>;

  const mockPayload = {
    sub: 'test@test.com', authorities: 'ADMIN',
    userId: 1, exp: 9999999999, iat: 1000000000
  };

  beforeEach(() => {
    tokenSpy = jasmine.createSpyObj('TokenService', [
      'setAccessToken', 'setRefreshToken', 'clearTokens',
      'getAccessToken', 'getRefreshToken', 'decodePayload',
      'isTokenExpired', 'extractRole', 'extractUserId'
    ]);

    tokenSpy.isTokenExpired.and.returnValue(true);
    tokenSpy.decodePayload.and.returnValue(null);
    tokenSpy.extractRole.and.returnValue(null);
    tokenSpy.extractUserId.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimations(),
        { provide: TokenService, useValue: tokenSpy }
      ]
    });

    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn debe ser false inicialmente', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('userRole debe ser null inicialmente', () => {
    expect(service.userRole()).toBeNull();
  });

  it('userId debe ser null inicialmente', () => {
    expect(service.userId()).toBeNull();
  });

  it('currentUser debe ser null inicialmente', () => {
    expect(service.currentUser()).toBeNull();
  });

  it('debe hacer login y guardar tokens', () => {
    const mockResponse = {
      jwt: 'fake-jwt', refreshToken: 'fake-refresh',
      username: 'test@test.com', status: true, message: 'ok'
    };

    tokenSpy.decodePayload.and.returnValue(mockPayload);
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    service.login({ email: 'test@test.com', password: '123456' })
      .subscribe(res => expect(res.jwt).toBe('fake-jwt'));

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('fake-jwt');
    expect(tokenSpy.setRefreshToken).toHaveBeenCalledWith('fake-refresh');
  });

  it('login sin refreshToken no llama setRefreshToken', () => {
    const mockResponse = {
      jwt: 'fake-jwt', username: 'test@test.com', status: true, message: 'ok'
    };

    tokenSpy.decodePayload.and.returnValue(mockPayload);
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    service.login({ email: 'test@test.com', password: '123456' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    expect(tokenSpy.setRefreshToken).not.toHaveBeenCalled();
  });

  it('debe limpiar tokens al hacer logout', () => {
    service.logout();
    expect(tokenSpy.clearTokens).toHaveBeenCalled();
  });

  it('isLoggedIn debe ser false después del logout', () => {
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('debe llamar al endpoint de refresh', () => {
    tokenSpy.getRefreshToken.and.returnValue('old-refresh');
    const mockResponse = {
      jwt: 'new-jwt', refreshToken: 'new-refresh',
      username: 'test@test.com', status: true, message: 'ok'
    };

    service.refreshToken().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'old-refresh' });
    req.flush(mockResponse);

    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('new-jwt');
    expect(tokenSpy.setRefreshToken).toHaveBeenCalledWith('new-refresh');
  });

  it('refresh sin nuevo refreshToken no llama setRefreshToken', () => {
    tokenSpy.getRefreshToken.and.returnValue('old-refresh');
    const mockResponse = { jwt: 'new-jwt', status: true, message: 'ok' };

    service.refreshToken().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    req.flush(mockResponse);

    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('new-jwt');
    expect(tokenSpy.setRefreshToken).not.toHaveBeenCalled();
  });

  it('hasRole debe retornar true cuando el rol coincide', () => {
    tokenSpy.isTokenExpired.and.returnValue(false);
    tokenSpy.decodePayload.and.returnValue(mockPayload);
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    const freshService = TestBed.inject(AuthService);
    const mockResponse = {
      jwt: 'fake-jwt', refreshToken: 'fake-refresh',
      username: 'test@test.com', status: true, message: 'ok'
    };

    freshService.login({ email: 'test@test.com', password: '123' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    expect(freshService.hasRole('ADMIN')).toBeTrue();
  });

  it('hasRole debe retornar false cuando el rol no coincide', () => {
    expect(service.hasRole('ADMIN')).toBeFalse();
  });

  it('restoreSession debe restaurar usuario si token no expiró', () => {
    tokenSpy.isTokenExpired.and.returnValue(false);
    tokenSpy.decodePayload.and.returnValue(mockPayload);
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
    providers: [
      AuthService,
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: TokenService, useValue: tokenSpy }
    ]
  });

    const restoredService = TestBed.inject(AuthService);
    expect(restoredService.isLoggedIn()).toBeTrue();
    expect(restoredService.userRole()).toBe('ADMIN');
  });

  it('restoreSession debe limpiar tokens si expiró', () => {
    tokenSpy.isTokenExpired.and.returnValue(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
    providers: [
      AuthService,
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: TokenService, useValue: tokenSpy }
    ]
  });

    TestBed.inject(AuthService);
    expect(tokenSpy.clearTokens).toHaveBeenCalled();
  });
});
