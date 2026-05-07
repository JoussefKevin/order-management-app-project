import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth';
import { TokenService } from './token';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let tokenSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    tokenSpy = jasmine.createSpyObj('TokenService', [
      'getAccessToken',
      'getRefreshToken',
      'setAccessToken',
      'setRefreshToken',
      'clearTokens',
      'isTokenExpired',
      'decodePayload',
      'extractRole',
      'extractUserId',
    ]);
    tokenSpy.isTokenExpired.and.returnValue(true);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn debe ser false cuando no hay sesión activa', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('userId debe ser null cuando no hay sesión', () => {
    expect(service.userId()).toBeNull();
  });

  it('restoreSession debe llamar clearTokens cuando el token está expirado', () => {
    expect(tokenSpy.clearTokens).toHaveBeenCalled();
  });

  it('logout debe limpiar tokens y navegar a /login', () => {
    service.logout();
    expect(tokenSpy.clearTokens).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('logout debe dejar isLoggedIn en false', () => {
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('hasRole debe retornar false cuando no hay rol activo', () => {
    expect(service.hasRole('ADMIN')).toBeFalse();
  });

  it('login debe hacer POST y guardar el token', () => {
    const mockResponse = { jwt: 'fake-jwt' };
    tokenSpy.decodePayload.and.returnValue({
      sub: 'user@test.com',
      exp: 9999999999,
      iat: 0,
      authorities: 'ADMIN',
      userId: 1,
    });
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    service.login({ email: 'user@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('fake-jwt');
  });

  it('login debe guardar el refreshToken si la respuesta lo incluye', () => {
    const mockResponse = { jwt: 'fake-jwt', refreshToken: 'refresh-token' };
    tokenSpy.decodePayload.and.returnValue({
      sub: 'user@test.com',
      exp: 9999999999,
      iat: 0,
      authorities: 'ADMIN',
      userId: 1,
    });
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    service.login({ email: 'user@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    expect(tokenSpy.setRefreshToken).toHaveBeenCalledWith('refresh-token');
  });

  it('refreshToken debe hacer POST y actualizar el token', () => {
    const mockResponse = { jwt: 'new-jwt', refreshToken: 'new-refresh' };
    tokenSpy.getRefreshToken.and.returnValue('old-refresh');
    tokenSpy.extractRole.and.returnValue('ADMIN');

    service.refreshToken().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('new-jwt');
    expect(tokenSpy.setRefreshToken).toHaveBeenCalledWith('new-refresh');
  });

  it('refreshToken no debe guardar refreshToken si no viene en la respuesta', () => {
    const mockResponse = { jwt: 'new-jwt' };
    tokenSpy.getRefreshToken.and.returnValue('old-refresh');
    tokenSpy.extractRole.and.returnValue('ADMIN');

    service.refreshToken().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    req.flush(mockResponse);

    expect(tokenSpy.setAccessToken).toHaveBeenCalledWith('new-jwt');
    expect(tokenSpy.setRefreshToken).not.toHaveBeenCalled();
  });
});

describe('AuthService — sesión válida al iniciar', () => {
  let service: AuthService;
  let tokenSpy: jasmine.SpyObj<TokenService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    tokenSpy = jasmine.createSpyObj('TokenService', [
      'getAccessToken', 'getRefreshToken', 'setAccessToken', 'setRefreshToken',
      'clearTokens', 'isTokenExpired', 'decodePayload', 'extractRole', 'extractUserId',
    ]);
    tokenSpy.isTokenExpired.and.returnValue(false);
    tokenSpy.decodePayload.and.returnValue({
      sub: 'user@test.com', exp: 9999999999, iat: 0, authorities: 'ADMIN', userId: 1,
    });
    tokenSpy.extractRole.and.returnValue('ADMIN');
    tokenSpy.extractUserId.and.returnValue(1);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('isLoggedIn debe ser true si el token es válido', () => {
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('userRole debe ser ADMIN si el token es válido', () => {
    expect(service.userRole()).toBe('ADMIN');
  });

  it('hasRole debe retornar true para el rol correcto', () => {
    expect(service.hasRole('ADMIN')).toBeTrue();
  });

  it('restoreSession NO debe llamar clearTokens si el token es válido', () => {
    expect(tokenSpy.clearTokens).not.toHaveBeenCalled();
  });
});
