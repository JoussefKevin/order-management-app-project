import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductoListadoPresenter } from './producto-listado-presenter';
import { ProductoSemaforoPipe } from '../../../pipe/producto-semaforo-pipe';

describe('ProductoListadoPresenter', () => {
  let component: ProductoListadoPresenter;
  let fixture: ComponentFixture<ProductoListadoPresenter>;

  const mockProductos = [
    { id: 1, name: 'iPhone 15', stock: 10, price: 3800, description: 'Test' },
    { id: 2, name: 'Samsung', stock: 0, price: 2000, description: 'Test 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductoListadoPresenter,
        CommonModule,
        RouterTestingModule,
        ProductoSemaforoPipe
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(ProductoListadoPresenter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productos', mockProductos);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe recibir productos como input', () => {
    expect(component.productos()).toEqual(mockProductos as any);
  });

  it('debe emitir el id al eliminar', () => {
    let emittedId: number | undefined;
    component.eliminar.subscribe((id: number) => emittedId = id);
    component.eliminar.emit(1);
    expect(emittedId).toBe(1);
  });
});
