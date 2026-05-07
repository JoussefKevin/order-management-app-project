import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioCardPresenterComponent } from './usuario-card-presenter';

describe('UsuarioCardPresenterComponent', () => {
  let component: UsuarioCardPresenterComponent;
  let fixture: ComponentFixture<UsuarioCardPresenterComponent>;

  const mockUsuario = {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@test.com',
    signUpDate: '2026-01-01',
    totalSpent: 500,
    role: { id: 1, name: 'ADMIN' },
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCardPresenterComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(UsuarioCardPresenterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('usuario', mockUsuario);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('getRolLabel debe retornar el nombre del rol', () => {
    expect(component.getRolLabel(mockUsuario)).toBe('ADMIN');
  });

  it('getRolLabel debe retornar UNKNOWN si no hay rol', () => {
    const sinRol = { ...mockUsuario, role: null };
    expect(component.getRolLabel(sinRol)).toBe('UNKNOWN');
  });

  it('getRolColor debe retornar purple para ADMIN', () => {
    expect(component.getRolColor(mockUsuario)).toBe('purple');
  });

  it('getRolColor debe retornar green para CLIENT', () => {
    const client = { ...mockUsuario, role: { id: 2, name: 'CLIENT' } };
    expect(component.getRolColor(client)).toBe('green');
  });

  it('getRolColor debe retornar blue para SELLER', () => {
    const seller = { ...mockUsuario, role: { id: 3, name: 'SELLER' } };
    expect(component.getRolColor(seller)).toBe('blue');
  });

  it('getRolColor debe retornar gray para roles desconocidos', () => {
    const unknown = { ...mockUsuario, role: { id: 9, name: 'OTRO' } };
    expect(component.getRolColor(unknown)).toBe('gray');
  });

  it('debe emitir el id al eliminar', () => {
    let emittedId: number | undefined;
    component.eliminar.subscribe((id: number) => (emittedId = id));
    component.eliminar.emit(1);
    expect(emittedId).toBe(1);
  });
});
