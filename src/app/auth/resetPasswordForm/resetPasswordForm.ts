import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  MinLengthValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert-service';
import { RecoverPasswordPayolad } from '../../interfaces/auth/recover-password-payload';
import { Subject, takeUntil } from 'rxjs';
import { passwordMatchValidator } from '../../pages/profile/update-password/update-password.component';
import { ResetPasswordPayolad } from '../../interfaces/auth/reset-password-payload';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './resetPasswordForm.html',
  styleUrl: './resetPasswordForm.scss',
})
export class ResetPassword implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;

  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);

  private ngUnsubscribe: Subject<boolean> = new Subject();
  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        password2: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }
  token: string = '';
  isLoading = signal(false);
  loginError = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params['tokenuid'];
      takeUntil(this.ngUnsubscribe);
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password, password2 } = this.resetPasswordForm.value;
      const resetPasswordPayolad: ResetPasswordPayolad = { password, password2, token: this.token };

      this.isLoading.set(true);

      this.AuthService.resetPassword(resetPasswordPayolad).subscribe({
        next: () => {
          this.alert.success('Contraseña cambiada', 'Intente ingresar nuevamente');
          this.goToLoginPage();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.alert.errorResponse(err);
          this.isLoading.set(false);
          console.error('Error', err);
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  goToLoginPage() {
    this.router.navigateByUrl('/auth/login');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
