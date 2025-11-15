import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
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
import { ProgresoRutina } from '../../../interfaces/progresoRutina/progreso-rutina..interface';
import { CommonModule } from '@angular/common';
import { Ejercicio } from '../../../interfaces/ejercicio/ejercicio.interface';

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
  ],
  templateUrl: './seguimiento-rutina.html',
  styleUrl: './seguimiento-rutina.scss',
})
export class SeguimientoRutina implements OnInit {
  private progresoRutinaService = inject(ProgresoRutinaService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  progresoRutina!: ProgresoRutina;
  ejercicios: Ejercicio[] = [];

  forms: { [ejercicioId: number]: FormGroup } = {};

  ngOnInit(): void {
    this.progresoRutinaService.getLastActiveRoutine().subscribe((res) => {
      this.progresoRutina = res;

      this.ejercicios = this.progresoRutina?.entrenamiento?.ejerciciosEntrenamientos || [];

      this.ejercicios.forEach((ej: Ejercicio) => {
        this.forms[ej.id] = this.fb.group({
          peso: [0, Validators.required],
          repeticiones: [10, Validators.required],
        });
      });
      this.cdr.detectChanges();
    });
  }

  getForm(id: number) {
    return this.forms[id];
  }
}
