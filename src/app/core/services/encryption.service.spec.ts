import { TestBed } from '@angular/core/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [EncryptionService] });
    service = TestBed.inject(EncryptionService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe encriptar y desencriptar correctamente', () => {
    const original = 'mi-valor-secreto';
    const encrypted = service.encrypt(original);
    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('el valor encriptado no debe ser igual al original', () => {
    const original = 'valor-test';
    const encrypted = service.encrypt(original);
    expect(encrypted).not.toBe(original);
  });

  it('debe encriptar JWT tokens correctamente', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.signature';
    const encrypted = service.encrypt(jwt);
    expect(service.decrypt(encrypted)).toBe(jwt);
  });
});
