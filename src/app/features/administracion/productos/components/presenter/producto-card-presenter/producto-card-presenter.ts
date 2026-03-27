import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoResponseDto } from '../../../models/dto/producto-response.dto';
import { ProductoSemaforoPipe } from '../../../pipe/producto-semaforo-pipe';

@Component({
  selector: 'app-producto-card-presenter',
  imports: [CommonModule, ProductoSemaforoPipe],
  templateUrl: './producto-card-presenter.html',
  styleUrl: './producto-card-presenter.css'
})
export class ProductoCardPresenterComponent {
  readonly producto = input.required<ProductoResponseDto>();
  readonly eliminar = output<number>();
  readonly editar   = output<number>();
}
