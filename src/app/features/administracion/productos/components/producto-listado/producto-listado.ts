import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto';
import { ProductoListadoPresenter } from '../presenter/producto-listado-presenter/producto-listado-presenter';
@Component({
  selector: 'app-producto-listado',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductoListadoPresenter],
  templateUrl: './producto-listado.html',
  styleUrl: './producto-listado.css'
})
export class ProductoListadoComponent {

  private productoService = inject(ProductoService);
  private toastr          = inject(ToastrService);

  readonly page       = signal(0);
  readonly pageSize   = signal(10);
  readonly searchTerm = signal('');

  private searchSubject = new Subject<string>();

  readonly productosResource = this.productoService.getProductosResource(
    this.page,
    this.pageSize,
    this.searchTerm
  );

  readonly productos     = computed(() => this.productosResource.value()?.content ?? []);
  readonly totalElements = computed(() => this.productosResource.value()?.page.totalElements ?? 0);
  readonly totalPages    = computed(() => this.productosResource.value()?.page.totalPages ?? 0);
  readonly isLoading     = computed(() => this.productosResource.isLoading());
  readonly hasError      = computed(() =>
    this.productosResource.error() !== null &&
    this.productosResource.value() === undefined
  );
  readonly isEmpty = computed(() =>
    !this.isLoading() && !this.hasError() && this.productos().length === 0
  );

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.page.set(0);
    });
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  async onEliminar(id: number): Promise<void> {
    const result = await Swal.fire({
      title:              '¿Eliminar producto?',
      text:               'Esta acción no se puede deshacer.',
      icon:               'warning',
      showCancelButton:   true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor:  '#64748b',
      confirmButtonText:  'Sí, eliminar',
      cancelButtonText:   'Cancelar'
    });

    if (!result.isConfirmed) return;

    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado', 'Éxito');
        this.productosResource.reload();
      },
      error: () => this.toastr.error('No se pudo eliminar', 'Error')
    });
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
  }
}
