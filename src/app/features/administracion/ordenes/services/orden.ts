import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { OrdenResponseDto, PageOrdenResponse } from '../models/dto/orden-response.dto';
import { OrdenRequestDto } from '../models/dto/orden-request.dto';

@Injectable({ providedIn: 'root' })
export class OrdenService {

  private readonly apiUrl = `${environment.apiUrl}/orders`;
  private http = inject(HttpClient);


  getOrdenesByUsuarioResource(userId: number, page: Signal<number>, size: Signal<number>) {
    return httpResource<PageOrdenResponse>(
      () => `${this.apiUrl}/${userId}?page=${page()}&size=${size()}`
    );
  }

  getOrdenDetalleResource(id: number) {
    return httpResource<OrdenResponseDto>(
      () => id > 0 ? `${this.apiUrl}/detail/${id}` : undefined
    );
  }


  getDetalle(id: number) {
    return this.http.get<OrdenResponseDto>(`${this.apiUrl}/detail/${id}`);
  }

  crear(dto: OrdenRequestDto) {
    return this.http.post<OrdenResponseDto>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: OrdenRequestDto) {
    return this.http.put<OrdenResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  cancelar(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/cancel/${id}`, {});
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
