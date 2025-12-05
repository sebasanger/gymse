import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CreateUsuarioClienteDto } from '../../interfaces/user/usuario.interface';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert-service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  regiterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alert: AlertService
  ) {
    this.regiterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      documento: ['', [Validators.required]],
    });
  }
  registerError = signal<string | null>(null);

  onSubmit() {
    if (this.regiterForm.valid) {
      const { email, documento, fullName } = this.regiterForm.value;
      const registerRequestPayload: CreateUsuarioClienteDto = { email, documento, fullName };

      this.registerError.set(null);

      this.userService.saveCliente(registerRequestPayload).subscribe({
        next: () => {
          this.alert.success(
            'Se registro correctamente',
            'Se envio un mail al correo que registro para poder poner su contraseña y habilitar su usario, revise su bandeja de entrada.'
          );

          this.router.navigateByUrl('/auth/login');
        },
        error: (err) => {
          this.alert.errorResponse(err, 'Error al registrarse');
        },
      });
    } else {
      this.regiterForm.markAllAsTouched();
    }
  }

  goLoginPage() {
    this.router.navigateByUrl('/auth/login');
  }
}
