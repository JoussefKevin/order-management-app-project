import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto';
import { environment } from '../../../../../environments/environment';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService],
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('crear debe hacer POST con el dto', () => {
    const dto = { name: 'Producto Test', price: 100, stock: 10, description: 'desc' } as any;
    service.crear(dto).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({});
  });

  it('actualizar debe hacer PUT al endpoint correcto', () => {
    const dto = { name: 'Actualizado', price: 200, stock: 5, description: 'desc' } as any;
    service.actualizar(1, dto).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('eliminar debe hacer DELETE al endpoint correcto', () => {
    service.eliminar(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
