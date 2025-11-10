import { Component, inject, OnInit } from '@angular/core';

import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Ejercicio } from '../../../interfaces/ejercicio/ejercicio.interface';
import { CreateRutinaDto, Rutina } from '../../../interfaces/rutina/rutina.interface';
import { AlertService } from '../../../services/alert-service';
import { EjercicioService } from '../../../services/ejercicio-service';
import { RutinaService } from '../../../services/rutina-service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { GetUser } from '../../../interfaces/user/get-user.interface';
import { Usuario } from '../../../interfaces/user/usuario.interface';
import { Categoria } from '../../../interfaces/categoria/categoria.interface';
import { CategoriaService } from '../../../services/categoria-service';
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
    categoria: ['', Validators.required],
    usuarios: ['', Validators.required],
    entrenamientos: this.fb.array([]),
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
          this.rutina = res;
          this.rutinaForm.patchValue({
            nombre: res.nombre,
            descripcion: res.descripcion,
          });
        });
      }
    });
  }

  addEntrenamiento(): void {
    const ejercicioForm = this.fb.group({
      ejercicioId: [0, Validators.required],
      series: [4, Validators.required],
      repeticiones: [10, Validators.required],
      peso: [0, Validators.required],
    });

    const entrenamientoForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      categoria: [''],
      ejercicioEntrenamiento: this.fb.array([ejercicioForm]),
    });

    this.entrenamientosForm.push(entrenamientoForm);
    console.log(this.entrenamientosForms.value);
  }

  get entrenamientosForms(): FormArray {
    return this.rutinaForm.get('entrenamientos') as FormArray;
  }

  deleteEntrenamiento(entrenamientoIndex: any) {
    this.entrenamientosForm.removeAt(entrenamientoIndex);
  }

  onSubmit(): void {
    const formValue = this.rutinaForm.value;

    const dto: CreateRutinaDto = {
      nombre: formValue.nombre ?? '',
      descripcion: formValue.descripcion ?? '',
      //TODO: setear user
      userId: 1,
      entrenamientos: [],
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
}
