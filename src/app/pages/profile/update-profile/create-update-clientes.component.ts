import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UpdateAcountPayload } from '../../../interfaces/user/form-update-acount-payload';
import { User } from '../../../models/user.model';
import { AlertService } from '../../../services/alert-service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class UpdateProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public usuarioId: number | undefined;
  public usuario: User | undefined;

  usuarioForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', Validators.required],
    membresia: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.usuario = user;
        this.usuarioForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          documento: user.documento,
        });
      } else {
        this.alert.error('Error al obtener los datos del usuario', 'Intentelo nuevamente');
      }
      takeUntil(this.ngUnsubscribe);
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    const formValue = this.usuarioForm.value;
    const updateAcountPayload: UpdateAcountPayload = {
      fullName: formValue.fullName ?? '',
      email: formValue.email ?? '',
      documento: formValue.documento ?? '',
    };

    this.authService.updateAcount(updateAcountPayload).subscribe({
      next: () => {
        this.alert.success('Datos actualizados');
        this.router.navigateByUrl('pages');
      },
      error: (err) => {
        this.alert.errorResponse(err, 'Error al actualizar');
        console.error(err);
      },
    });
  }
}
