import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoResponseDto } from '../../../models/dto/producto-response.dto';
import { ProductoSemaforoPipe } from '../../../pipe/producto-semaforo-pipe';

@Component({
  selector: 'app-producto-listado-presenter',
  imports: [CommonModule, RouterLink, ProductoSemaforoPipe],
  templateUrl: './producto-listado-presenter.html',
  styleUrl: './producto-listado-presenter.css'
})
export class ProductoListadoPresenter {


  readonly productos = input.required<ProductoResponseDto[]>();
  readonly eliminar  = output<number>();
  readonly editar    = output<number>();

  onEditar(id: number):   void { this.editar.emit(id); }
  onEliminar(id: number): void { this.eliminar.emit(id); }
}
