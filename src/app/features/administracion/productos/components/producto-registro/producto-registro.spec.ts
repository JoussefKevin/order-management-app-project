import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductoRegistroComponent } from './producto-registro';
import { environment } from '../../../../../../environments/environment';

describe('ProductoRegistroComponent (modo crear)', () => {
  let component: ProductoRegistroComponent;
  let fixture: ComponentFixture<ProductoRegistroComponent>;
  const routeSinId = {
    snapshot: { paramMap: { get: (_: string) => null } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductoRegistroComponent,
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSinId },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ProductoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('isEditing debe ser false en modo crear', () => {
    expect(component.isEditing()).toBeFalse();
  });

  it('isLoading debe ser false inicialmente', () => {
    expect(component.isLoading()).toBeFalse();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('getter name debe devolver el control del formulario', () => {
    expect(component.name).toBeTruthy();
  });

  it('getter stock debe devolver el control del formulario', () => {
    expect(component.stock).toBeTruthy();
  });

  it('getter price debe devolver el control del formulario', () => {
    expect(component.price).toBeTruthy();
  });

  it('getter description debe devolver el control del formulario', () => {
    expect(component.description).toBeTruthy();
  });

  it('onSubmit con formulario inválido debe marcar campos como tocados', () => {
    component.onSubmit();
    expect(component.name.touched).toBeTrue();
  });

  it('onSubmit valido en modo crear debe hacer POST', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.name.setValue('Producto Test');
    component.stock.setValue(10);
    component.price.setValue(100.0);
    component.description.setValue('Descripcion valida del producto');
    component.onSubmit();
    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, name: 'Producto Test', price: 100, stock: 10, description: 'desc', taxes: [] });
  });
});

describe('ProductoRegistroComponent (modo editar)', () => {
  let component: ProductoRegistroComponent;
  let fixture: ComponentFixture<ProductoRegistroComponent>;

  const routeConId = {
    snapshot: { paramMap: { get: (_: string) => '5' } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductoRegistroComponent,
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeConId },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ProductoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('isEditing debe ser true cuando hay id en la ruta', () => {
    expect(component.isEditing()).toBeTrue();
  });

  it('isLoading debe ser true mientras carga el producto', () => {
    expect(component.isLoading()).toBeTrue();
  });

  it('productoId no debe ser null en modo editar', () => {
    expect(component.isEditing()).toBeTrue();
  });
});
