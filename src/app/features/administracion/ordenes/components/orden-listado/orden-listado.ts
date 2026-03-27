import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../core/auth/services/auth';
import { OrdenListadoPresenterComponent } from '../presenter/orden-listado-presenter/orden-listado-presenter';
import { OrdenService } from '../../services/orden';

@Component({
  selector: 'app-orden-listado',
  standalone: true,
  imports: [CommonModule, RouterLink, OrdenListadoPresenterComponent],
  templateUrl: './orden-listado.html',
  styleUrl: './orden-listado.css'
})
export class OrdenListado {

  private ordenService = inject(OrdenService);
  private authService  = inject(AuthService);
  private toastr       = inject(ToastrService);

  readonly page     = signal(0);
  readonly pageSize = signal(10);

  readonly ordenesResource = this.ordenService.getOrdenesByUsuarioResource(
    this.authService.userId()!,
    this.page,
    this.pageSize
  );

  readonly ordenes       = computed(() => this.ordenesResource.value()?.content ?? []);
  readonly totalElements = computed(() => this.ordenesResource.value()?.page.totalElements ?? 0);
  readonly totalPages    = computed(() => this.ordenesResource.value()?.page.totalPages ?? 0);
  readonly isLoading     = computed(() => this.ordenesResource.isLoading());
  readonly hasError      = computed(() =>
    this.ordenesResource.error() !== null &&
    this.ordenesResource.value() === undefined
  );
  readonly isEmpty = computed(() =>
    !this.isLoading() && !this.hasError() && this.ordenes().length === 0
  );
  async onCancelar(id: number): Promise<void> {
    const result = await Swal.fire({
      title:              '¿Cancelar orden?',
      icon:               'warning',
      showCancelButton:   true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor:  '#64748b',
      confirmButtonText:  'Sí, cancelar',
      cancelButtonText:   'No'
    });

    if (!result.isConfirmed) return;

    this.ordenService.cancelar(id).subscribe({
      next: () => {
        this.toastr.success('Orden cancelada', 'Éxito');
        this.ordenesResource.reload();
      },
      error: () => this.toastr.error('No se pudo cancelar', 'Error')
    });
  }

  async onEliminar(id: number): Promise<void> {
    const result = await Swal.fire({
      title:              '¿Eliminar orden?',
      text:               'Esta acción no se puede deshacer.',
      icon:               'warning',
      showCancelButton:   true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor:  '#64748b',
      confirmButtonText:  'Sí, eliminar',
      cancelButtonText:   'Cancelar'
    });

    if (!result.isConfirmed) return;

    this.ordenService.eliminar(id).subscribe({
      next: () => {
        this.toastr.success('Orden eliminada', 'Éxito');
        this.ordenesResource.reload();
      },
      error: () => this.toastr.error('No se pudo eliminar', 'Error')
    });
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
  }
}

