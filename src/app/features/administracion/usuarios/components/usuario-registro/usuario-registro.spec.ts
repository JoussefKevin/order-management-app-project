import { AbstractControl, FormControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

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
