import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductoListadoComponent } from './producto-listado';
import { ProductoService } from '../../services/producto';
import { environment } from '../../../../../../environments/environment';

describe('ProductoListadoComponent', () => {
  let component: ProductoListadoComponent;
  let fixture: ComponentFixture<ProductoListadoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductoListadoComponent,
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ToastrModule.forRoot(),
      ],
      providers: [provideAnimations()],
    }).compileComponents();

    httpMock  = TestBed.inject(HttpTestingController);
    fixture   = TestBed.createComponent(ProductoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('page debe comenzar en 0', () => {
    expect(component.page()).toBe(0);
  });

  it('pageSize debe comenzar en 10', () => {
    expect(component.pageSize()).toBe(10);
  });

  it('searchTerm debe comenzar vacío', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('onPageChange debe actualizar la página', () => {
    component.onPageChange(2);
    expect(component.page()).toBe(2);
  });

  it('onSearch debe poder llamarse sin error', () => {
    expect(() => component.onSearch('laptop')).not.toThrow();
  });

  it('isLoading debe ser true mientras carga el recurso', () => {
    expect(component.isLoading()).toBeTrue();
  });

  it('productos, totalElements y totalPages deben retornar fallbacks mientras carga', () => {
    expect(component.productos()).toEqual([]);
    expect(component.totalElements()).toBe(0);
    expect(component.totalPages()).toBe(0);
  });

  it('productos debe tener items cuando el recurso carga con datos', async () => {
    const mockData = {
      content: [{ id: 1, name: 'Laptop', price: 999, stock: 10, description: 'desc', taxes: [] }],
      page: { size: 10, totalElements: 1, totalPages: 1, number: 0 }
    };
    httpMock.expectOne(`${environment.apiUrl}/products?page=0&size=10`).flush(mockData);
    await Promise.resolve();
    TestBed.inject(ApplicationRef).tick();
    fixture.detectChanges();
    expect(component.productos().length).toBe(1);
    expect(component.totalElements()).toBe(1);
    expect(component.totalPages()).toBe(1);
    expect(component.isEmpty()).toBeFalse();
  });

  it('isEmpty debe ser true cuando el recurso carga con lista vacia', async () => {
    const mockData = {
      content: [],
      page: { size: 10, totalElements: 0, totalPages: 0, number: 0 }
    };
    httpMock.expectOne(`${environment.apiUrl}/products?page=0&size=10`).flush(mockData);
    await Promise.resolve();
    TestBed.inject(ApplicationRef).tick();
    fixture.detectChanges();
    expect(component.isEmpty()).toBeTrue();
  });

  it('hasError debe ser true cuando el recurso falla', async () => {
    httpMock.expectOne(`${environment.apiUrl}/products?page=0&size=10`)
      .flush('Error', { status: 500, statusText: 'Server Error' });
    await Promise.resolve();
    expect(component.hasError()).toBeTrue();
  });

  it('onEliminar no hace nada si el usuario no confirma', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    await component.onEliminar(1);
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('onEliminar llama al servicio si el usuario confirma', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    const productoService = TestBed.inject(ProductoService);
    spyOn(productoService, 'eliminar').and.returnValue(of(undefined));
    await component.onEliminar(1);
    expect(productoService.eliminar).toHaveBeenCalledWith(1);
  });
});
