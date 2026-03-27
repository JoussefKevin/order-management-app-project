import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productoSemaforo',
  standalone: true
})
export class ProductoSemaforoPipe implements PipeTransform {
  transform(stock: number): 'danger' | 'warning' | 'success' {
    if (stock === 0)   return 'danger';
    if (stock <= 5)    return 'warning';
    return 'success';
  }
}
