import { LoginComponent } from './login';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('el email debe ser requerido', () => {
    const email = component.email;
    expect(email.errors?.['required']).toBeTruthy();
  });

  it('el email debe validar formato correcto', () => {
    component.email.setValue('no-es-email');
    expect(component.email.errors?.['email']).toBeTruthy();
    component.email.setValue('test@gmail.com');
    expect(component.email.errors).toBeNull();
  });

  it('la contraseña debe tener mínimo 6 caracteres', () => {
    component.password.setValue('abc');
    expect(component.password.errors?.['minlength']).toBeTruthy();
    component.password.setValue('abcdef');
    expect(component.password.errors).toBeNull();
  });

  it('el formulario debe ser válido con datos correctos', () => {
    component.email.setValue('test@gmail.com');
    component.password.setValue('password123');
    expect(component.form.valid).toBeTrue();
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

  it('no debe llamar a login si el formulario es inválido', () => {
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('debe llamar a login cuando el formulario es válido', () => {
    authSpy.login.and.returnValue(of({ jwt: 'token', status: true } as any));
    component.email.setValue('test@gmail.com');
    component.password.setValue('password123');
    component.onSubmit();
    expect(authSpy.login).toHaveBeenCalled();
  });

  it('debe manejar error en login', () => {
    authSpy.login.and.returnValue(throwError(() => ({
      error: { message: 'Credenciales incorrectas' }
    })));
    component.email.setValue('test@gmail.com');
    component.password.setValue('password123');
    component.onSubmit();
    expect(component.isLoading()).toBeFalse();
  });
});
