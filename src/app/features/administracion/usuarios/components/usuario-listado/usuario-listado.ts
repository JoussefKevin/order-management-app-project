import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioCardPresenterComponent } from '../presenter/usuario-card-presenter/usuario-card-presenter';
import { UsuarioService } from '../../services/usuario';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-usuario-listado',
  imports: [CommonModule, RouterLink],
  templateUrl: './usuario-listado.html',
  styleUrl: './usuario-listado.css'
})
export class UsuarioListadoComponent {

  private usuarioService = inject(UsuarioService);
  private toastr         = inject(ToastrService);

  readonly page     = signal(0);
  readonly pageSize = signal(10);

  readonly usuariosResource = this.usuarioService.getUsuariosResource(
    this.page,
    this.pageSize
  );

  readonly usuarios      = computed(() => this.usuariosResource.value()?.content ?? []);
  readonly totalElements = computed(() => this.usuariosResource.value()?.totalElements ?? 0);
  readonly totalPages    = computed(() => this.usuariosResource.value()?.totalPages ?? 0);
  readonly isLoading     = computed(() => this.usuariosResource.isLoading());
  readonly hasError      = computed(() =>
    this.usuariosResource.error() !== null &&
    this.usuariosResource.value() === undefined
  );
  readonly isEmpty = computed(() =>
    !this.isLoading() && !this.hasError() && this.usuarios().length === 0
  );
  onPageChange(newPage: number): void {
    this.page.set(newPage);
  }
}
