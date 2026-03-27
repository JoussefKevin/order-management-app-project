import { TestBed } from '@angular/core/testing';
import { EncryptionService } from '../../services/encryption.service';
import { TokenService } from './token';

describe('TokenService', () => {
  let service: TokenService;
  let encryptionSpy: jasmine.SpyObj<EncryptionService>;

  beforeEach(() => {
    encryptionSpy = jasmine.createSpyObj('EncryptionService', ['encrypt', 'decrypt']);
    encryptionSpy.encrypt.and.callFake((v: string) => btoa(v));
    encryptionSpy.decrypt.and.callFake((v: string) => atob(v));

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: EncryptionService, useValue: encryptionSpy }
      ]
    });

    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe guardar y recuperar el access token', () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.test.signature';
    service.setAccessToken(fakeToken);
    expect(service.getAccessToken()).toBe(fakeToken);
  });

  it('debe guardar y recuperar el refresh token', () => {
    const fakeRefresh = 'refresh-token-test';
    service.setRefreshToken(fakeRefresh);
    expect(service.getRefreshToken()).toBe(fakeRefresh);
  });

  it('debe retornar null si no hay access token', () => {
    expect(service.getAccessToken()).toBeNull();
  });

  it('debe limpiar los tokens', () => {
    service.setAccessToken('token');
    service.setRefreshToken('refresh');
    service.clearTokens();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });

  it('debe detectar token expirado', () => {
    const pastPayload = { sub: 'test@test.com', exp: 1000, iat: 999, authorities: 'ADMIN', userId: 1 };
    const fakeToken = `header.${btoa(JSON.stringify(pastPayload))}.signature`;
    service.setAccessToken(fakeToken);
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('debe detectar token válido (no expirado)', () => {
    const futurePayload = {
      sub: 'test@test.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      authorities: 'ADMIN',
      userId: 1
    };
    const fakeToken = `header.${btoa(JSON.stringify(futurePayload))}.signature`;
    service.setAccessToken(fakeToken);
    expect(service.isTokenExpired()).toBeFalse();
  });

  it('debe extraer el rol correctamente', () => {
    const payload = {
      sub: 'test@test.com', authorities: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000), userId: 1
    };
    const fakeToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    service.setAccessToken(fakeToken);
    expect(service.extractRole()).toBe('ADMIN');
  });

  it('debe extraer el userId correctamente', () => {
    const payload = {
      sub: 'test@test.com', authorities: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000), userId: 5
    };
    const fakeToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    service.setAccessToken(fakeToken);
    expect(service.extractUserId()).toBe(5);
  });
});
