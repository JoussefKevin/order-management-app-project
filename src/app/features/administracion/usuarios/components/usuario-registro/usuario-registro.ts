import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UsuarioRequestDto } from '../../models/dto/usuario-request.dto';
import { UsuarioService } from '../../services/usuario';


function strongPassword(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const hasUpper   = /[A-Z]/.test(value);
  const hasNumber  = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);
  return hasUpper && hasNumber && hasSpecial
    ? null
    : { strongPassword: true };
}

@Component({
  selector: 'app-usuario-registro',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './usuario-registro.html',
  styleUrl: './usuario-registro.css'
})
export class UsuarioRegistro {

  private fb             = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router         = inject(Router);
  private toastr         = inject(ToastrService);

  readonly isLoading    = signal(false);
  readonly showPassword = signal(false);

  form = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), strongPassword]],
    roleId:   [2,  [Validators.required]]
  });

  get name()     { return this.form.get('name')!; }
  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get roleId()   { return this.form.get('roleId')!; }

  togglePassword(): void { this.showPassword.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading.set(true);
    const dto = this.form.getRawValue() as unknown as UsuarioRequestDto;

    this.usuarioService.crear(dto).subscribe({
      next: () => {
        this.toastr.success('Usuario creado correctamente', 'Éxito');
        this.router.navigate(['/administracion/usuarios']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message ?? 'Error al crear el usuario';
        this.toastr.error(msg, 'Error');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
