import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Clase } from '../../../interfaces/clases/clase.interface';
import { AlertService } from '../../../services/alert-service';
import { ClaseService } from '../../../services/clase-service';

@Component({
  selector: 'app-create-update-clases',
  templateUrl: './create-update-clases.component.html',
  styleUrl: './create-update-clases.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CreateUpdateClasesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly claseService = inject(ClaseService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public claseId: number | undefined;
  public clase: Clase | undefined;

  membresiaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    capacidad: this.fb.control<number | null>(5),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.claseId = params['id'];
      takeUntil(this.ngUnsubscribe);

      if (this.claseId && this.claseId > 0) {
        this.claseService.findById(this.claseId).subscribe((res) => {
          this.clase = res;
          this.membresiaForm.patchValue({
            nombre: res.nombre,
            descripcion: res.descripcion,
            capacidad: res.capacidad,
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
      capacidad: formValue.capacidad ?? 0,
      fechas: [],
    };

    const action = this.claseId
      ? this.claseService.updateSpecific({
          id: this.claseId,
          ...dto,
        })
      : this.claseService.saveSpecific(dto);

    action.subscribe({
      next: () => {
        this.alert.success(this.claseId ? 'Clase actualizada' : 'Clase guardada');
        this.router.navigateByUrl('pages/clase');
      },
      error: (err) => {
        this.alert.errorResponse(err, this.claseId ? 'Error al actualizar' : 'Error al guardar');
        console.error(err);
      },
    });
  }
}
