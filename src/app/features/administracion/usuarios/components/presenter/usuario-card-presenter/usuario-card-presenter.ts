import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponseDto } from '../../../models/dto/usuario-response.dto';

@Component({
  selector: 'app-usuario-card-presenter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-card-presenter.html',
  styleUrl: './usuario-card-presenter.css'
})
export class UsuarioCardPresenterComponent {

  readonly usuario = input.required<UsuarioResponseDto>();
  readonly eliminar = output<number>();

  getRolLabel(usuario: UsuarioResponseDto): string {
  return usuario.role?.name ?? 'UNKNOWN';
  }

  getRolColor(usuario: UsuarioResponseDto): string {
    const colors: Record<string, string> = {
      ADMIN:  'purple',
      CLIENT: 'green',
      SELLER: 'blue'
    };
    return colors[usuario.role?.name] ?? 'gray';
  }
}
