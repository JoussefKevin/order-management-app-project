import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AbstractControl, FormControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { UsuarioRegistro } from './usuario-registro';
import { environment } from '../../../../../../environments/environment';

function strongPassword(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const hasUpper   = /[A-Z]/.test(value);
  const hasNumber  = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);
  return hasUpper && hasNumber && hasSpecial ? null : { strongPassword: true };
}

describe('strongPassword Validator', () => {
  it('debe retornar null si la contraseña es fuerte', () => {
    const control = new FormControl('Password1!');
    expect(strongPassword(control)).toBeNull();
  });

  it('debe retornar error si no tiene mayúscula', () => {
    const control = new FormControl('password1!');
    expect(strongPassword(control)).toEqual({ strongPassword: true });
  });

  it('debe retornar error si no tiene número', () => {
    const control = new FormControl('Password!');
    expect(strongPassword(control)).toEqual({ strongPassword: true });
  });

  it('debe retornar error si no tiene carácter especial', () => {
    const control = new FormControl('Password1');
    expect(strongPassword(control)).toEqual({ strongPassword: true });
  });

  it('debe retornar null si el valor está vacío', () => {
    const control = new FormControl('');
    expect(strongPassword(control)).toBeNull();
  });
});

describe('UsuarioRegistro', () => {
  let component: UsuarioRegistro;
  let fixture: ComponentFixture<UsuarioRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsuarioRegistro,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture   = TestBed.createComponent(UsuarioRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('isLoading debe ser false inicialmente', () => {
    expect(component.isLoading()).toBeFalse();
  });

  it('showPassword debe ser false inicialmente', () => {
    expect(component.showPassword()).toBeFalse();
  });

  it('togglePassword debe cambiar showPassword', () => {
    component.togglePassword();
    expect(component.showPassword()).toBeTrue();
    component.togglePassword();
    expect(component.showPassword()).toBeFalse();
  });

  it('onSubmit con formulario inválido debe marcar campos como tocados', () => {
    component.onSubmit();
    expect(component.name.touched).toBeTrue();
    expect(component.email.touched).toBeTrue();
  });

  it('password debe tener error strongPassword con contraseña débil', () => {
    component.password.setValue('sinmayuscula');
    expect(component.password.errors?.['strongPassword']).toBeTrue();
  });

  it('onSubmit valido debe hacer POST al servicio', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.name.setValue('Usuario Test');
    component.email.setValue('test@test.com');
    component.password.setValue('Password1!');
    component.onSubmit();
    const req = httpMock.expectOne(`${environment.apiUrl}/users/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, name: 'Usuario Test', email: 'test@test.com', signUpDate: '2024-01-01', totalSpent: 0, role: { id: 2, name: 'CLIENT' } });
  });
});
