import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProductoRequestDto } from '../models/dto/producto-request.dto';
import { ProductoResponseDto } from '../models/dto/producto-response.dto';

export interface PageInfo {
  size:          number;
  totalElements: number;
  totalPages:    number;
  number:        number;
}

export interface PageResponse<T> {
  content: T[];
  page:    PageInfo;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private readonly apiUrl = `${environment.apiUrl}/products`;
  private http = inject(HttpClient);

  getProductosResource(page: Signal<number>, size: Signal<number>, search?: Signal<string>) {
    return httpResource<PageResponse<ProductoResponseDto>>(
      () => {
        let url = `${this.apiUrl}?page=${page()}&size=${size()}`;
        if (search && search().trim()) {
          url += `&name=${encodeURIComponent(search())}`;
        }
        return url;
      }
    );
  }

  getProductoByIdResource(id: number) {
    return httpResource<ProductoResponseDto>(
      () => id > 0 ? `${this.apiUrl}/${id}` : undefined
    );
  }

  crear(dto: ProductoRequestDto) {
    return this.http.post<ProductoResponseDto>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: ProductoRequestDto) {
    return this.http.put<ProductoResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
