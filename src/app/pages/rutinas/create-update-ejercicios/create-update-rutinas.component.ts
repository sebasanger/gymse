import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Categoria } from '../../../interfaces/categoria/categoria.interface';
import { Ejercicio } from '../../../interfaces/ejercicio/ejercicio.interface';
import { CreateRutinaDto, Rutina } from '../../../interfaces/rutina/rutina.interface';
import { Usuario } from '../../../interfaces/user/usuario.interface';
import { AlertService } from '../../../services/alert-service';
import { CategoriaService } from '../../../services/categoria-service';
import { EjercicioService } from '../../../services/ejercicio-service';
import { RutinaService } from '../../../services/rutina-service';
import { UserService } from '../../../services/user.service';
import { minLengthArray } from '../../../utils/validators';
@Component({
  selector: 'app-create-update-rutinas',
  templateUrl: './create-update-rutinas.component.html',
  styleUrl: './create-update-rutinas.component.scss',
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class CreateUpdateRutinasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rutinaService = inject(RutinaService);
  private readonly usuarioService = inject(UserService);
  private readonly ejercicioService = inject(EjercicioService);
  private readonly categoriaService = inject(CategoriaService);
  private ngUnsubscribe: Subject<boolean> = new Subject();

  public rutinaId: number | undefined;
  public rutina: Rutina | undefined;

  public ejercicios: Ejercicio[] = [];
  public usuarios: Usuario[] = [];
  public categorias: Categoria[] = [];

  rutinaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuarios: [[]],

    entrenamientos: this.fb.array(
      [
        this.fb.group({
          nombre: ['', Validators.required],
          descripcion: ['', Validators.required],
          categoria: [null, Validators.required],
          ejercicioEntrenamiento: this.fb.array(
            [
              this.fb.group({
                ejercicioId: [null, Validators.required],
                series: [4, Validators.required],
                repeticiones: [10, Validators.required],
                peso: [0, Validators.required],
              }),
            ],
            [minLengthArray(1)]
          ),
        }),
      ],
      [minLengthArray(1)]
    ),
  });

  get entrenamientosForm() {
    return this.rutinaForm.controls['entrenamientos'] as FormArray;
  }

  ngOnInit(): void {
    this.ejercicioService.findAll().subscribe((res) => {
      this.ejercicios = res;
    });
    this.usuarioService.findAll().subscribe((res) => {
      this.usuarios = res;
    });
    this.categoriaService.findAll().subscribe((res) => {
      this.categorias = res;
    });

    this.route.params.subscribe((params) => {
      this.rutinaId = params['id'];
      takeUntil(this.ngUnsubscribe);

      if (this.rutinaId && this.rutinaId > 0) {
        this.rutinaService.findById(this.rutinaId).subscribe((res) => {
          if (res) {
            this.loadRutina(res);
          }
        });
      }
    });
  }

  onSubmit(): void {
    const formValue = this.rutinaForm.value;

    const dto: CreateRutinaDto = {
      nombre: formValue.nombre ?? '',
      descripcion: formValue.descripcion ?? '',
      usuariosId: formValue.usuarios ?? [],
      entrenamientos: (formValue.entrenamientos ?? []).map((entrenamiento: any) => ({
        nombre: entrenamiento.nombre ?? '',
        descripcion: entrenamiento.descripcion ?? '',
        categoria: entrenamiento.categoria ?? '',
        ejercicioEntrenamiento: (entrenamiento.ejercicioEntrenamiento ?? []).map((ej: any) => ({
          ejercicioId: ej.ejercicioId,
          series: ej.series,
          repeticiones: ej.repeticiones,
          peso: ej.peso,
        })),
      })),
    };

    const action = this.rutinaId
      ? this.rutinaService.updateSpecific({ id: this.rutinaId, ...dto })
      : this.rutinaService.saveSpecific(dto);

    action.subscribe({
      next: () => {
        this.alert.success(this.rutinaId ? 'Rutina actualizada' : 'Rutina guardada');
        this.router.navigateByUrl('pages/rutinas');
      },
      error: (err) => {
        this.alert.errorResponse(err, this.rutinaId ? 'Error al actualizar' : 'Error al guardar');
        console.error(err);
      },
    });
  }

  getEjerciciosFormArray(entrenamientoIndex: number): FormArray {
    return this.entrenamientosForm
      .at(entrenamientoIndex)
      .get('ejercicioEntrenamiento') as FormArray;
  }

  addEntrenamiento(): void {
    const ejercicioForm = this.fb.group({
      ejercicioId: [0, Validators.required],
      series: [4, Validators.required],
      repeticiones: [10, Validators.required],
      peso: [0, Validators.required],
    });

    const entrenamientoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      ejercicioEntrenamiento: this.fb.array([ejercicioForm], Validators.required),
    });

    this.entrenamientosForm.push(entrenamientoForm);
  }

  deleteEntrenamiento(entrenamientoIndex: any) {
    this.entrenamientosForm.removeAt(entrenamientoIndex);
  }

  addEjercicio(entrenamientoIndex: number): void {
    const ejercicioForm = this.fb.group({
      ejercicioId: [0, Validators.required],
      series: [4, Validators.required],
      repeticiones: [10, Validators.required],
      peso: [0, Validators.required],
    });
    this.getEjerciciosFormArray(entrenamientoIndex).push(ejercicioForm);
  }

  deleteEjercicio(entrenamientoIndex: number, ejercicioIndex: number): void {
    this.getEjerciciosFormArray(entrenamientoIndex).removeAt(ejercicioIndex);
  }

  loadRutina(rutina: any): void {
    this.entrenamientosForm.clear();

    this.rutinaForm.patchValue({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion,
    });

    rutina.entrenamientos.forEach((entrenamiento: any) => {
      const ejerciciosArray = this.fb.array<FormGroup>([]);

      entrenamiento.ejerciciosEntrenamientos.forEach((ej: any) => {
        const ejercicioGroup = this.fb.group({
          ejercicioId: [ej.ejercicio.id, Validators.required],
          series: [ej.series, Validators.required],
          repeticiones: [ej.repeticiones, Validators.required],
          peso: [ej.peso, Validators.required],
        });

        ejerciciosArray.push(ejercicioGroup);
      });

      const entrenamientoGroup = this.fb.group({
        nombre: [entrenamiento.nombre, Validators.required],
        descripcion: [entrenamiento.descripcion, Validators.required],
        categoria: [entrenamiento.categoria?.id, Validators.required],
        ejercicioEntrenamiento: ejerciciosArray,
      });

      this.entrenamientosForm.push(entrenamientoGroup);
    });
  }
}
