import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { LoginRequestPayload } from '../../interfaces/auth/login-request.payload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private AuthService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  isLoading = signal(false);
  loginError = signal<string | null>(null);
  hidePassword = signal(true);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginRequestPayload: LoginRequestPayload = { email, password };

      this.isLoading.set(true);
      this.loginError.set(null);

      this.AuthService.login(loginRequestPayload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigateByUrl('/pages');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.loginError.set('Credenciales inválidas.');
          console.error('Error en login', err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
