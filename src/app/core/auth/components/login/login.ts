import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthRequestDto } from '../../models/dto/auth-request.dto';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);
  private toastr      = inject(ToastrService);

  readonly isLoading    = signal(false);
  readonly showPassword = signal(false);
  readonly errorMsg     = signal<string | null>(null);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);
    const credentials = this.form.getRawValue() as AuthRequestDto;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.toastr.success('Bienvenido al sistema', '¡Login exitoso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const status = err.status;
        if (status === 401) {
          this.errorMsg.set('Correo electrónico o contraseña incorrectos.');
        } else {
          this.errorMsg.set(err.error?.message ?? 'Ocurrió un error. Intenta nuevamente.');
        }
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
