import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ValidateAcountPayload } from '../../interfaces/auth/validate-acount-payload';
import { passwordMatchValidator } from '../../pages/profile/update-password/update-password.component';
import { AlertService } from '../../services/alert-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-validate-acount',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './validateAcount.html',
  styleUrl: './validateAcount.scss',
})
export class ValidateAcount implements OnInit, OnDestroy {
  validateAcountForm: FormGroup;

  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);

  private ngUnsubscribe: Subject<boolean> = new Subject();
  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {
    this.validateAcountForm = this.fb.group(
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
    if (this.validateAcountForm.valid) {
      const { password, password2 } = this.validateAcountForm.value;
      const validateAcountPayload: ValidateAcountPayload = {
        password,
        password2,
        token: this.token,
      };

      this.isLoading.set(true);

      this.AuthService.validateAcount(validateAcountPayload).subscribe({
        next: () => {
          this.alert.success('Cuenta activada', 'Intente ingresar');
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
      this.validateAcountForm.markAllAsTouched();
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
