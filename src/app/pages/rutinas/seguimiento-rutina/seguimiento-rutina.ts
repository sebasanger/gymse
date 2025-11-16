import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
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
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { EjercicioEntrenamientoConProgreso } from '../../../interfaces/ejercicioEntrenamiento/ejercicio-entrenamiento.interface';
import { GuardarProgresoEjercicio } from '../../../interfaces/progresoEjercicio/progreso-ejercicio..interface';
import { ProgresoRutinaConProgreso } from '../../../interfaces/progresoRutina/progreso-rutina..interface';
import { Serie } from '../../../interfaces/serie/serie.interface';
import { AlertService } from '../../../services/alert-service';
import { ProgresoEjercicioService } from '../../../services/progreso-ejercicio-service';
import { ProgresoRutinaService } from '../../../services/progreso-rutina-service';
import { SafeUrlPipe } from '../../../pipes/SafeUrlPipe';

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
    SafeUrlPipe,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  templateUrl: './seguimiento-rutina.html',
  styleUrl: './seguimiento-rutina.scss',
})
export class SeguimientoRutina implements OnInit {
  private alertService = inject(AlertService);
  private progresoRutinaService = inject(ProgresoRutinaService);
  private progresoEjercicioService = inject(ProgresoEjercicioService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  progresoRutina!: ProgresoRutinaConProgreso;
  ejerciciosEntrenamientos: EjercicioEntrenamientoConProgreso[] = [];

  forms: { [ejercicioId: number]: FormGroup } = {};

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.progresoRutinaService.getCurrentRoutine().subscribe((res) => {
      if (!res) {
        return;
      }
      this.progresoRutina = res;

      this.ejerciciosEntrenamientos = (
        this.progresoRutina?.entrenamientoSeleccionado.ejercicios || []
      ).sort((a, b) => a.id - b.id);

      this.ejerciciosEntrenamientos.forEach(
        (ejercicioEntrenamiento: EjercicioEntrenamientoConProgreso) => {
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
        }
      );
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

  guardarProgresoEjercicio(ejercicioEntrenamientoConProgreso: EjercicioEntrenamientoConProgreso) {
    const form = this.getForm(ejercicioEntrenamientoConProgreso.id);

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.alertService
      .confirm('¿Guardar progreso?', 'Se registrará el progreso del ejercicio.')
      .then((result) => {
        if (!result.isConfirmed) return;

        const series: Serie[] = form.get('ejercicioEntrenamiento')?.value ?? [];

        const saveProgresoEjercicio: GuardarProgresoEjercicio = {
          cantidadSeries: series.length,
          ejercicioId: ejercicioEntrenamientoConProgreso.ejercicio.id,
          progresoRutinaId: this.progresoRutina.id,
          series: series,
        };

        this.progresoEjercicioService.saveSpecific(saveProgresoEjercicio).subscribe({
          next: (res) => {
            ejercicioEntrenamientoConProgreso.progreso = res;

            this.cdr.detectChanges();
            this.alertService.success('Progreso guardado');
          },
          error: (err) => this.alertService.errorResponse(err),
        });
      });
  }

  eliminarProgreso(ejercicioEntrenamiento: EjercicioEntrenamientoConProgreso) {
    this.alertService.confirmDelete('¿Deseas eliminar el progreso?').then((result) => {
      if (result.isConfirmed) {
        this.progresoEjercicioService
          .deleteById(ejercicioEntrenamiento.progreso?.id ?? 0)
          .subscribe({
            next: () => {
              ejercicioEntrenamiento.progreso = undefined;

              this.cdr.detectChanges();
              this.alertService.success('Progreso eliminado');
            },
            error: (err) => this.alertService.errorResponse(err),
          });
      }
    });
  }

  get hasAnyProgress(): boolean {
    return !!(
      this.progresoRutina &&
      this.progresoRutina.entrenamientoSeleccionado &&
      Array.isArray(this.progresoRutina.entrenamientoSeleccionado.ejercicios) &&
      this.progresoRutina.entrenamientoSeleccionado.ejercicios.some((e) => !!e.progreso)
    );
  }
}
