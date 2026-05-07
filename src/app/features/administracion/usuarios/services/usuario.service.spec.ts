import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario';
import { environment } from '../../../../../environments/environment';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService],
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('crear debe hacer POST al endpoint de registro', () => {
    const dto = {
      name: 'Juan',
      email: 'juan@test.com',
      password: 'Password1!',
      roleId: 2,
    } as any;
    service.crear(dto).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({});
  });
});
