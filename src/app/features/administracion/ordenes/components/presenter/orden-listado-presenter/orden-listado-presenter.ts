import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenListResponseDto } from '../../../models/dto/orden-response.dto';
import { OrdenStatusPipe } from '../../../pipe/orden-status-pipe';

@Component({
  selector: 'app-orden-listado-presenter',
  standalone: true,
  imports: [CommonModule, RouterLink, OrdenStatusPipe],
  templateUrl: './orden-listado-presenter.html',
  styleUrl: './orden-listado-presenter.css'
})
export class OrdenListadoPresenterComponent {
  readonly ordenes  = input.required<OrdenListResponseDto[]>();
  readonly cancelar = output<number>();
  readonly eliminar = output<number>();
}
