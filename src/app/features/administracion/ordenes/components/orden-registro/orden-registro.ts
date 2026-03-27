import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../../productos/services/producto';
import { AuthService } from '../../../../../core/auth/services/auth';
import { OrdenRequestDto, OrdenItemRequestDto } from '../../models/dto/orden-request.dto';
import { ProductoResponseDto } from '../../../productos/models/dto/producto-response.dto';
import { OrdenService } from '../../services/orden';

@Component({
  selector: 'app-orden-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './orden-registro.html',
  styleUrl: './orden-registro.css'
})
export class OrdenRegistroComponent implements OnInit {

  private fb              = inject(FormBuilder);
  private ordenService    = inject(OrdenService);
  private productoService = inject(ProductoService);
  private authService     = inject(AuthService);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private toastr          = inject(ToastrService);

  readonly isLoading  = signal(false);
  readonly isEditing  = signal(false);
  readonly productos  = signal<ProductoResponseDto[]>([]);
  private ordenId: number | null = null;

  private readonly _page     = signal(0);
  private readonly _pageSize = signal(100);

  private readonly productosResource = this.productoService.getProductosResource(
    this._page,
    this._pageSize
  );

  form = this.fb.group({
    items: this.fb.array([])
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor() {
    effect(() => {
      const data = this.productosResource.value();
      if (data?.content && data.content.length > 0) {
        this.productos.set(data.content);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.ordenId = +id;
      this.cargarOrden(+id);
    } else {
      this.agregarItem();
    }
  }


  private cargarOrden(id: number): void {
    this.isLoading.set(true);
    this.ordenService.getDetalle(id).subscribe({
      next: (orden) => {
        while (this.items.length) this.items.removeAt(0);
        if (orden.items && orden.items.length > 0) {
          orden.items.forEach((item: any) => {
            this.items.push(this.crearItemGroup({
              id:        item.id,
              productId: item.productId,
              quantity:  item.quantity
            }));
          });
        } else {
          this.agregarItem();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.agregarItem();
        this.toastr.error('No se pudo cargar la orden', 'Error');
      }
    });
  }

  private crearItemGroup(data?: Partial<OrdenItemRequestDto>) {
    return this.fb.group({
      id:        [data?.id        ?? null],
      productId: [data?.productId ?? null, [Validators.required]],
      quantity:  [data?.quantity  ?? 1,    [Validators.required, Validators.min(1)]]
    });
  }

  agregarItem(): void {
    this.items.push(this.crearItemGroup());
  }

  quitarItem(index: number): void {
    if (this.items.length > 1) this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading.set(true);

    const items: OrdenItemRequestDto[] = this.items.value.map((item: any) => {
      const clean: OrdenItemRequestDto = {
        productId: Number(item.productId),
        quantity:  Number(item.quantity)
      };
      if (item.id) clean.id = Number(item.id);
      return clean;
    });

    const dto: OrdenRequestDto = {
      userId: Number(this.authService.userId()!),
      items
    };

    const request$ = this.isEditing()
      ? this.ordenService.actualizar(this.ordenId!, dto)
      : this.ordenService.crear(dto);

    request$.subscribe({
      next: () => {
        const msg = this.isEditing() ? 'Orden actualizada' : 'Orden creada';
        this.toastr.success(msg, 'Éxito');
        this.router.navigate(['/administracion/ordenes']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err.error?.message ?? 'Error al guardar', 'Error');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
