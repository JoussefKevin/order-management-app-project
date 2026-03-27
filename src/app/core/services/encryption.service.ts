import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

const SECRET = 'oms-secret-key-2024-angular21';

@Injectable({ providedIn: 'root' })
export class EncryptionService {

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, SECRET).toString();
  }

  decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
