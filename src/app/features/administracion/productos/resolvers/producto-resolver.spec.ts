import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { productoResolver } from './producto-resolver';
import { environment } from '../../../../../environments/environment';

describe('productoResolver', () => {
  let httpMock: HttpTestingController;

  const executeResolver: ResolveFn<any> = (...params) =>
    TestBed.runInInjectionContext(() => productoResolver(...params));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('debe hacer GET con el id de la ruta', () => {
    const mockRoute = {
      paramMap: { get: (key: string) => (key === 'id' ? '5' : null) },
    } as unknown as ActivatedRouteSnapshot;

    executeResolver(mockRoute, {} as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/products/5`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 5, name: 'Producto' });
  });
});
