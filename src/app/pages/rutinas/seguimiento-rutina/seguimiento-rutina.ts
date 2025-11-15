import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ProgresoRutinaService } from '../../../services/progreso-rutina-service';
import {
  ProgresoRutina,
  ProgresoRutinaActiva,
} from '../../../interfaces/progresoRutina/progreso-rutina..interface';
import { CommonModule } from '@angular/common';
import { Ejercicio } from '../../../interfaces/ejercicio/ejercicio.interface';
import { EjercicioEntrenamiento } from '../../../interfaces/ejercicioEntrenamiento/ejercicio-entrenamiento.interface';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ProgresoEjercicioService } from '../../../services/progreso-ejercicio-service';
import { GuardarProgresoEjercicio } from '../../../interfaces/progresoEjercicio/progreso-ejercicio..interface';

@Component({
  selector: 'app-seguimiento-rutina',
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './seguimiento-rutina.html',
  styleUrl: './seguimiento-rutina.scss',
})
export class SeguimientoRutina implements OnInit {
  private progresoRutinaService = inject(ProgresoRutinaService);
  private progresoEjercicioService = inject(ProgresoEjercicioService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  progresoRutina!: ProgresoRutinaActiva;
  ejerciciosEntrenamientos: EjercicioEntrenamiento[] = [];

  forms: { [ejercicioId: number]: FormGroup } = {};

  ngOnInit(): void {
    this.progresoRutinaService.getLastActiveRoutine().subscribe((res) => {
      this.progresoRutina = res;

      this.ejerciciosEntrenamientos =
        this.progresoRutina?.entrenamientoSeleccionado.ejercicios || [];

      this.ejerciciosEntrenamientos.forEach((ejercicioEntrenamiento: EjercicioEntrenamiento) => {
        const seriesArray = this.fb.array<FormGroup>([]);

        for (let index = 0; index < ejercicioEntrenamiento.series; index++) {
          const serieForm = this.fb.group({
            repeticiones: [ejercicioEntrenamiento.repeticiones, Validators.required],
            peso: [ejercicioEntrenamiento.peso, Validators.required],
          });

          seriesArray.push(serieForm);
        }

        const ejercicioForm = this.fb.group({
          ejercicioEntrenamiento: seriesArray,
        });

        this.forms[ejercicioEntrenamiento.id] = ejercicioForm;
      });
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  getForm(id: number) {
    return this.forms[id];
  }

  getSeriesFormArray(ejercicioId: number): FormArray {
    return this.forms[ejercicioId]?.get('ejercicioEntrenamiento') as FormArray;
  }

  eliminarSerie(ejercicioId: number, serieId: number) {
    this.getSeriesFormArray(ejercicioId).removeAt(serieId);
  }

  agregarSerie(ejercicioId: number) {
    const form = this.getSeriesFormArray(ejercicioId);
    const serieForm = this.fb.group({
      repeticiones: [10, Validators.required],
      peso: [0, Validators.required],
    });

    form.push(serieForm);
  }

  guardarProgresoEjercicio(id: number) {
    const form = this.getForm(id);

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const saveProgresoEjercicio: GuardarProgresoEjercicio = {
      cantidadSeries: 3,
      ejercicioId: id,
      progresoRutinaId: this.progresoRutina.id,
      series: form?.get('ejercicioEntrenamiento')?.value ?? [],
    };

    this.progresoEjercicioService.saveSpecific(saveProgresoEjercicio).subscribe((res) => {
      console.log('Guardado');
    });
  }
}
