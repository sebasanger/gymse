import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { Categoria } from '../../../interfaces/categoria/categoria.interface';
import {
  CreateEjercicio,
  Ejercicio,
  UpdateEjercicio,
} from '../../../interfaces/ejercicio/ejercicio.interface';
import { CategoriaService } from '../../../services/categoria-service';
import { EjercicioService } from '../../../services/ejercicio-service';
import Swal from 'sweetalert2';
import { AlertService } from '../../../services/alert-service';
@Component({
  selector: 'app-create-update-ejercicios',
  templateUrl: './create-update-ejercicios.component.html',
  styleUrl: './create-update-ejercicios.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CreateUpdateEjerciciosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ejercicioService = inject(EjercicioService);
  private readonly categoriaService = inject(CategoriaService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public ejercicioId: number | undefined;
  public ejercicio: Ejercicio | undefined;
  public categorias: Categoria[] = [];

  ejercicioForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
  });

  hasUnitNumber = false;

  states = [];

  ngOnInit(): void {
    this.categoriaService
      .findAll()
      .pipe(map((categorias) => categorias.filter((e) => e.tipo == 'EJERCICIO')))
      .subscribe((res) => {
        this.categorias = res;
      });

    this.route.params.subscribe((params) => {
      this.ejercicioId = params['id'];
      takeUntil(this.ngUnsubscribe);

      if (this.ejercicioId && this.ejercicioId > 0) {
        this.ejercicioService.findById(this.ejercicioId).subscribe((res) => {
          this.ejercicio = res;
          this.ejercicioForm.patchValue({
            nombre: res.nombre,
            descripcion: res.descripcion,
            categoria: res.categoria?.categoria ?? null,
          });
        });
      }
    });
  }

  onSubmit(): void {
    const formValue = this.ejercicioForm.value;

    const dto = {
      nombre: formValue.nombre ?? '',
      descripcion: formValue.descripcion ?? '',
      categoria: formValue.categoria ?? '',
    };

    const action = this.ejercicioId
      ? this.ejercicioService.updateSpecific({ id: this.ejercicioId, ...dto })
      : this.ejercicioService.saveSpecific(dto);

    action.subscribe({
      next: () => {
        this.alert.success(this.ejercicioId ? 'Ejercicio actualizado' : 'Ejercicio guardado');
        this.router.navigateByUrl('pages/ejercicios');
      },
      error: (err) => {
        this.alert.error(this.ejercicioId ? 'Error al actualizar' : 'Error al guardar');
        console.error(err);
      },
    });
  }
}
