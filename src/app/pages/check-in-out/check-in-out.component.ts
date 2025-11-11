import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgresoRutinaService } from '../../services/progreso-rutina-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-in-out',
  templateUrl: './check-in-out.component.html',
  styleUrl: './check-in-out.component.scss',
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CheckInOutComponent {
  checkForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private progresoRutinaService: ProgresoRutinaService,
    private snack: MatSnackBar
  ) {
    this.checkForm = this.fb.group({
      documento: ['', Validators.required],
    });
  }

  onCheckIn() {
    const documento = this.checkForm.value.documento;
    this.progresoRutinaService.checkIn(documento).subscribe({
      next: () => this.snack.open('Check-in registrado ✅', 'Cerrar', { duration: 3000 }),
    });
  }

  onCheckOut() {
    const documento = this.checkForm.value.documento;
    this.progresoRutinaService.checkOut(documento).subscribe({
      next: () => this.snack.open('Check-out registrado ⏱️', 'Cerrar', { duration: 3000 }),
    });
  }
}
