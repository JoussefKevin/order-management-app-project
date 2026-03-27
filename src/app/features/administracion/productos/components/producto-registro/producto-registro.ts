import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductoRequestDto } from '../../models/dto/producto-request.dto';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-registro',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './producto-registro.html',
  styleUrl: './producto-registro.css'
})
export class ProductoRegistroComponent implements OnInit {

  private fb              = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private toastr          = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly isEditing = signal(false);
  private productoId: number | null = null;

  private readonly productoResource =
    this.productoService.getProductoByIdResource(
      +this.route.snapshot.paramMap.get('id')! || 0
    );

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(3)]],
    stock:       [0,  [Validators.required, Validators.min(0)]],
    price:       [0,  [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]],
    taxesId:     [[1], [Validators.required]]
  });

  get name()        { return this.form.get('name')!; }
  get stock()       { return this.form.get('stock')!; }
  get price()       { return this.form.get('price')!; }
  get description() { return this.form.get('description')!; }

  constructor() {
    effect(() => {
      const producto = this.productoResource.value();
      if (producto) {
        this.form.patchValue({
          name:        producto.name,
          stock:       producto.stock,
          price:       producto.price,
          description: producto.description,
          taxesId:     producto.taxes?.map((t: any) => t.id) ?? [1]
        });
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.productoId = +id;
      this.isLoading.set(true);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading.set(true);
    const dto = this.form.getRawValue() as unknown as ProductoRequestDto;

    const request$ = this.isEditing()
      ? this.productoService.actualizar(this.productoId!, dto)
      : this.productoService.crear(dto);

    request$.subscribe({
      next: () => {
        const msg = this.isEditing() ? 'Producto actualizado' : 'Producto creado';
        this.toastr.success(msg, 'Éxito');
        this.router.navigate(['/administracion/productos']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message ?? 'Ocurrió un error';
        this.toastr.error(msg, 'Error');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
