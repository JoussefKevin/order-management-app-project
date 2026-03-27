import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenResponseDto } from '../../../models/dto/orden-response.dto';
import { OrdenStatusPipe } from '../../../pipe/orden-status-pipe';

@Component({
  selector: 'app-orden-card-presenter',
  standalone: true,
  imports: [CommonModule, RouterLink, OrdenStatusPipe],
  templateUrl: './orden-card-presenter.html',
  styleUrl: './orden-card-presenter.css'
})
export class OrdenCardPresenterComponent {
  readonly orden    = input.required<OrdenResponseDto>();
  readonly cancelar = output<number>();
  readonly eliminar = output<number>();
}
