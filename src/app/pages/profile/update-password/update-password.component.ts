import { Component, inject } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { UpdatePasswordPayolad } from '../../../interfaces/user/update-password-payload';
import { User } from '../../../models/user.model';
import { AlertService } from '../../../services/alert-service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class UpdatePasswordComponent {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  public usuarioId: number | undefined;
  public usuario: User | undefined;

  passwordForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  onSubmit(): void {
    if (this.passwordForm.invalid) return;

    const formValue = this.passwordForm.value;

    const updatePasswordPayload: UpdatePasswordPayolad = {
      oldPassword: formValue.oldPassword ?? '',
      password: formValue.password ?? '',
      password2: formValue.password2 ?? '',
    };

    this.authService.updatePassword(updatePasswordPayload).subscribe({
      next: () => {
        this.alert.success('Contraseña actualizada');
        this.router.navigateByUrl('pages');
      },
      error: (err) => {
        this.alert.errorResponse(err, 'Error al actualizar');
        console.error(err);
      },
    });
  }
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password');
  const pass2 = control.get('password2');

  if (!pass || !pass2) return null;

  // si no coinciden, marcamos el control password2 con error
  if (pass.value !== pass2.value) {
    pass2.setErrors({ passwordsMismatch: true });
    return { passwordsMismatch: true };
  }

  // si coinciden, limpiamos SOLO este error (sin pisar otros)
  if (pass2.hasError('passwordsMismatch')) {
    pass2.setErrors(null);
  }

  return null;
}
