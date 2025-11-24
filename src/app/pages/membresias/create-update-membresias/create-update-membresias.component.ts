import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Membresia } from '../../../interfaces/membresia/membresia.interface';
import { Role, ROLES } from '../../../interfaces/roles/roles.enum';
import { AlertService } from '../../../services/alert-service';
import { MembresiaService } from '../../../services/membresia-service';

@Component({
  selector: 'app-create-update-membresias',
  templateUrl: './create-update-membresias.component.html',
  styleUrl: './create-update-membresias.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CreateUpdateMembresiasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly membresiaService = inject(MembresiaService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public membresiaId: number | undefined;
  public membresia: Membresia | undefined;
  public roles: Role[] = ROLES;

  membresiaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    precio: this.fb.control<number | null>(null, Validators.required),
    cantidadClases: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.membresiaId = params['id'];
      takeUntil(this.ngUnsubscribe);

      if (this.membresiaId && this.membresiaId > 0) {
        this.membresiaService.findById(this.membresiaId).subscribe((res) => {
          this.membresia = res;
          this.membresiaForm.patchValue({
            nombre: res.nombre,
            descripcion: res.descripcion,
            precio: res.precio,
            cantidadClases: res.cantidadClases,
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.membresiaForm.invalid) return;

    const formValue = this.membresiaForm.value;

    const dto = {
      nombre: formValue.nombre ?? '',
      descripcion: formValue.descripcion ?? '',
      precio: formValue.precio ?? 0,
      cantidadClases: formValue.cantidadClases ?? 0,
    };

    const action = this.membresiaId
      ? this.membresiaService.update({
          id: this.membresiaId,
          ...dto,
        })
      : this.membresiaService.save(dto);

    action.subscribe({
      next: () => {
        this.alert.success(this.membresiaId ? 'Membresia actualizada' : 'Membresia guardada');
        this.router.navigateByUrl('pages/membresias');
      },
      error: (err) => {
        this.alert.errorResponse(
          err,
          this.membresiaId ? 'Error al actualizar' : 'Error al guardar'
        );
        console.error(err);
      },
    });
  }
}
