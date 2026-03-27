import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OrdenStatusPipe } from '../../pipe/orden-status-pipe';
import { OrdenService } from '../../services/orden';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, OrdenStatusPipe],
  templateUrl: './orden-detalle.html',
  styleUrl: './orden-detalle.css'
})
export class OrdenDetalleComponent {

  private route        = inject(ActivatedRoute);
  private ordenService = inject(OrdenService);
  private toastr       = inject(ToastrService);
  private router       = inject(Router);

  private readonly id = +this.route.snapshot.paramMap.get('id')!;

  readonly ordenResource = this.ordenService.getOrdenDetalleResource(this.id);
  readonly orden         = computed(() => this.ordenResource.value());
  readonly isLoading     = computed(() => this.ordenResource.isLoading());


  readonly hasError = computed(() =>
    this.ordenResource.error() !== null &&
    this.ordenResource.value() === undefined
  );

  async onCancelar(): Promise<void> {
    const result = await Swal.fire({
      title:              '¿Cancelar esta orden?',
      icon:               'warning',
      showCancelButton:   true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor:  '#64748b',
      confirmButtonText:  'Sí, cancelar',
      cancelButtonText:   'No'
    });

    if (!result.isConfirmed) return;

    this.ordenService.cancelar(this.id).subscribe({
      next: () => {
        this.toastr.success('Orden cancelada', 'Éxito');
        this.ordenResource.reload();
      },
      error: () => this.toastr.error('No se pudo cancelar', 'Error')
    });
  }
}
