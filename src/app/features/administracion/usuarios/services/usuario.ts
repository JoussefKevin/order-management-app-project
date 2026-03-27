import { Injectable, Signal, WritableSignal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { UsuarioRequestDto } from '../models/dto/usuario-request.dto';
import { UsuarioResponseDto } from '../models/dto/usuario-response.dto';

export interface PageInfo {
  content:       UsuarioResponseDto[];
  totalElements: number;
  totalPages:    number;
  number:        number;
  size:          number;
}

export interface PageUsuarioResponse {
  content:       UsuarioResponseDto[];
  totalElements: number;
  totalPages:    number;
  number:        number;
  size:          number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly apiUrl = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  getUsuariosResource(page: Signal<number>, size: Signal<number>) {
    return httpResource<PageUsuarioResponse>(
      () => `${this.apiUrl}?page=${page()}&size=${size()}`
    );
  }

  crear(dto: UsuarioRequestDto) {
    return this.http.post<UsuarioResponseDto>(
      `${this.apiUrl}/register`, dto
    );
  }
}
