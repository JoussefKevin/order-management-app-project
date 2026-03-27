import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProductoResponseDto } from '../models/dto/producto-response.dto';

export const productoResolver: ResolveFn<ProductoResponseDto> = (route) => {
  const http = inject(HttpClient);
  const id   = route.paramMap.get('id');
  return http.get<ProductoResponseDto>(`${environment.apiUrl}/products/${id}`);
};
