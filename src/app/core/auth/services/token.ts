import { Injectable, inject } from '@angular/core';
import { TokenPayload } from '../models/model/token-payload.model';
import { EncryptionService } from '../../services/encryption.service';

const KEY_ACCESS  = '_oms_access';
const KEY_REFRESH = '_oms_refresh';

@Injectable({ providedIn: 'root' })
export class TokenService {

  private encryption = inject(EncryptionService);

  setAccessToken(token: string): void {
    localStorage.setItem(KEY_ACCESS, this.encryption.encrypt(token));
  }

  getAccessToken(): string | null {
    const raw = localStorage.getItem(KEY_ACCESS);
    if (!raw) return null;
    try {
      return this.encryption.decrypt(raw);
    } catch {
      return null;
    }
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(KEY_REFRESH, this.encryption.encrypt(token));
  }

  getRefreshToken(): string | null {
    const raw = localStorage.getItem(KEY_REFRESH);
    if (!raw) return null;
    try {
      return this.encryption.decrypt(raw);
    } catch {
      return null;
    }
  }

  clearTokens(): void {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
  }

  decodePayload(): TokenPayload | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const base64Payload = token.split('.')[1];
      return JSON.parse(atob(base64Payload)) as TokenPayload;
    } catch {
      return null;
    }
  }

  extractRole(): string | null {
    const payload = this.decodePayload();
    if (!payload?.authorities) return null;
    return payload.authorities.split(',')[0].trim().replace('ROLE_', '');
  }

  extractUserId(): number | null {
    const payload = this.decodePayload();
    if (!payload?.userId) return null;
    return payload.userId;
  }

  isTokenExpired(): boolean {
    const payload = this.decodePayload();
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
  }
}
