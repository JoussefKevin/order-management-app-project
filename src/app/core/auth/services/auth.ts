import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { TokenPayload } from '../models/model/token-payload.model';
import { TokenService } from './token';
import { AuthRequestDto } from '../models/dto/auth-request.dto';
import { AuthResponseDto } from '../models/dto/auth-response.dto';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly _currentUser = signal<TokenPayload | null>(null);
  private readonly _userRole    = signal<string | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn  = computed(() => this._currentUser() !== null);
  readonly userRole    = this._userRole.asReadonly();
  private readonly _userId = signal<number | null>(null);
  readonly userId = this._userId.asReadonly();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.restoreSession();
  }

  login(credentials: AuthRequestDto) {
    return this.http.post<AuthResponseDto>(
      `${this.apiUrl}/login`, credentials
    ).pipe(
      tap(response => {
        this.tokenService.setAccessToken(response.jwt);
        if (response.refreshToken) {
          this.tokenService.setRefreshToken(response.refreshToken);
        }
        this._currentUser.set(this.tokenService.decodePayload());
        this._userRole.set(this.tokenService.extractRole());
        this._userId.set(this.tokenService.extractUserId());
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this._currentUser.set(null);
    this._userRole.set(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthResponseDto>(
      `${this.apiUrl}/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        this.tokenService.setAccessToken(response.jwt);
        if (response.refreshToken) {
          this.tokenService.setRefreshToken(response.refreshToken);
        }
        this._userRole.set(this.tokenService.extractRole());
      })
    );
  }

  private restoreSession(): void {
  if (!this.tokenService.isTokenExpired()) {
    this._currentUser.set(this.tokenService.decodePayload());
    this._userRole.set(this.tokenService.extractRole());
    this._userId.set(this.tokenService.extractUserId());
  } else {
    this.tokenService.clearTokens();
  }
}

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }
}
