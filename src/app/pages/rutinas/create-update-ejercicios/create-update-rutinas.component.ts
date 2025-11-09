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
import { Ejercicio } from '../../../interfaces/ejercicio/ejercicio.interface';
import { AlertService } from '../../../services/alert-service';
import { CategoriaService } from '../../../services/categoria-service';
import { EjercicioService } from '../../../services/ejercicio-service';
import { RutinaService } from '../../../services/rutina-service';
import { Rutina } from '../../../interfaces/rutina/rutina.interface';
@Component({
  selector: 'app-create-update-rutinas',
  templateUrl: './create-update-rutinas.component.html',
  styleUrl: './create-update-rutinas.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CreateUpdateRutinasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rutinaService = inject(RutinaService);
  private readonly ejercicioService = inject(EjercicioService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public rutinaId: number | undefined;
  public rutina: Rutina | undefined;

  public ejercicios: Ejercicio[] = [];

  rutinaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
    ejercicios: [[], Validators.required],
  });

  ngOnInit(): void {
    this.ejercicioService.findAll().subscribe((res) => {
      this.ejercicios = res;
    });

    this.route.params.subscribe((params) => {
      this.rutinaId = params['id'];
      takeUntil(this.ngUnsubscribe);

      if (this.rutinaId && this.rutinaId > 0) {
        this.rutinaService.findById(this.rutinaId).subscribe((res) => {
          this.rutina = res;
          this.rutinaForm.patchValue({
            nombre: res.nombre,
            descripcion: res.descripcion,
          });
        });
      }
    });
  }

  onSubmit(): void {
    const formValue = this.rutinaForm.value;

    const dto = {
      nombre: formValue.nombre ?? '',
      descripcion: formValue.descripcion ?? '',
      categoria: formValue.categoria ?? '',
      entrenamientos: [],
    };

    const action = this.rutinaId
      ? this.rutinaService.updateSpecific({ id: this.rutinaId, ...dto })
      : this.rutinaService.saveSpecific(dto);

    action.subscribe({
      next: () => {
        this.alert.success(this.rutinaId ? 'Ejercicio actualizado' : 'Ejercicio guardado');
        this.router.navigateByUrl('pages/ejercicios');
      },
      error: (err) => {
        this.alert.errorResponse(err, this.rutinaId ? 'Error al actualizar' : 'Error al guardar');
        console.error(err);
      },
    });
  }
}
