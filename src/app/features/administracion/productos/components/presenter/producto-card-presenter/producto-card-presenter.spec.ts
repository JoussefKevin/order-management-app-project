import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoCardPresenterComponent } from './producto-card-presenter';

describe('ProductoCardPresenterComponent', () => {
  let component: ProductoCardPresenterComponent;
  let fixture: ComponentFixture<ProductoCardPresenterComponent>;

  const mockProducto = {
    id: 1,
    name: 'Laptop',
    price: 1500,
    stock: 10,
    description: 'Laptop de prueba',
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoCardPresenterComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(ProductoCardPresenterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('producto', mockProducto);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe recibir el producto como input', () => {
    expect(component.producto()).toEqual(mockProducto);
  });

  it('debe emitir el id al eliminar', () => {
    let emittedId: number | undefined;
    component.eliminar.subscribe((id: number) => (emittedId = id));
    component.eliminar.emit(1);
    expect(emittedId).toBe(1);
  });

  it('debe emitir el id al editar', () => {
    let emittedId: number | undefined;
    component.editar.subscribe((id: number) => (emittedId = id));
    component.editar.emit(1);
    expect(emittedId).toBe(1);
  });
});
