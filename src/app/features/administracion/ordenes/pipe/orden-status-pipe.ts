import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordenStatus', standalone: true })
export class OrdenStatusPipe implements PipeTransform {
  transform(status: string): string {
    const map: Record<string, string> = {
      PENDING:   'Pendiente',
      CONFIRMED: 'Confirmado',
      CANCELLED: 'Cancelado',
      DELIVERED: 'Entregado'
    };
    return map[status] ?? status;
  }
}
