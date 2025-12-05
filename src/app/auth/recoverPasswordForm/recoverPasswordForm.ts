import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert-service';
import { RecoverPasswordPayolad } from '../../interfaces/auth/recover-password-payload';

@Component({
  selector: 'app-recover-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './recoverPasswordForm.html',
  styleUrl: './recoverPasswordForm.scss',
})
export class RecoverPassword {
  recoverPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {
    this.recoverPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  isLoading = signal(false);
  loginError = signal<string | null>(null);

  onSubmit() {
    if (this.recoverPasswordForm.valid) {
      const { email } = this.recoverPasswordForm.value;
      const resetPasswordPayload: RecoverPasswordPayolad = { email };

      this.isLoading.set(true);

      this.AuthService.recoverPassword(resetPasswordPayload).subscribe({
        next: () => {
          this.alert.success(
            'Mail enviado',
            'Para recuperar su contraseña, revise su correo y siga las instrucciones'
          );
          this.isLoading.set(false);
        },
        error: (err) => {
          this.alert.errorResponse(err);
          this.isLoading.set(false);
          console.error('Error', err);
        },
      });
    } else {
      this.recoverPasswordForm.markAllAsTouched();
    }
  }

  goToLoginPage() {
    this.router.navigateByUrl('/auth/login');
  }
}
