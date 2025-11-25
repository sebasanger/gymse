import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Role, ROLES } from '../../../interfaces/roles/roles.enum';
import { GetUser } from '../../../interfaces/user/get-user.interface';
import { AlertService } from '../../../services/alert-service';
import { UserService } from '../../../services/user.service';
import { Membresia } from '../../../interfaces/membresia/membresia.interface';
import { MembresiaService } from '../../../services/membresia-service';
@Component({
  selector: 'app-create-update-clientes',
  templateUrl: './create-update-clientes.component.html',
  styleUrl: './create-update-clientes.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CreateUpdateClientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly membresiaService = inject(MembresiaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public usuarioId: number | undefined;
  public usuario: GetUser | undefined;
  public membresias: Membresia[] | undefined;

  usuarioForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', Validators.required],
    membresia: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.usuarioId = params['id'];
      takeUntil(this.ngUnsubscribe);

      this.membresiaService.findAll().subscribe((res) => {
        this.membresias = res;
      });

      if (this.usuarioId && this.usuarioId > 0) {
        this.userService.findById(this.usuarioId).subscribe((res) => {
          this.usuario = res;
          this.usuarioForm.patchValue({
            fullName: res.fullName,
            email: res.email,
            documento: res.documento,
            membresia: res.id ?? undefined,
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;
    const rol: Role = 'CLIENTE';

    const formValue = this.usuarioForm.value;
    const dto = {
      fullName: formValue.fullName ?? '',
      email: formValue.email ?? '',
      documento: formValue.documento ?? '',
      roles: [rol],
    };

    const action = this.usuarioId
      ? this.userService.updateSpecific({
          id: this.usuarioId,
          ...dto,
        })
      : this.userService.saveSpecific(dto);

    action.subscribe({
      next: () => {
        this.alert.success(this.usuarioId ? 'Usuario actualizado' : 'Usuario guardado');
        this.router.navigateByUrl('pages/usuarios');
      },
      error: (err) => {
        this.alert.errorResponse(err, this.usuarioId ? 'Error al actualizar' : 'Error al guardar');
        console.error(err);
      },
    });
  }
}
