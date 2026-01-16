import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClaseService } from '../../../services/clase-service';
import { AlertService } from '../../../services/alert-service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-update-clases',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    MatDividerModule,

    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-update-clases.component.html',
})
export class CreateUpdateClasesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private claseService = inject(ClaseService);
  private alert = inject(AlertService);

  claseId?: number;

  // FORM PRINCIPAL
  membresiaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    capacidad: [5, Validators.required],
    fechas: this.fb.array([]),
  });

  // FORM TEMPORAL PARA DATEPICKER
  nuevaFechaForm = this.fb.group({
    fecha: [null, Validators.required],
    hora: ['', Validators.required],
  });

  get fechas(): FormArray {
    return this.membresiaForm.get('fechas') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.claseId = +params['id'];

      if (this.claseId) {
        this.claseService.findById(this.claseId).subscribe((res) => {
          this.membresiaForm.patchValue({
            nombre: res.nombre,
            descripcion: res.descripcion,
            capacidad: res.capacidad,
          });

          // precargar fechas
          res.fechasClases.forEach((dt: string) => {
            const date = new Date(dt);
            this.fechas.push(
              this.fb.group({
                fecha: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                hora: date.toTimeString().slice(0, 5),
              })
            );
          });
        });
      }
    });
  }

  addFecha(): void {
    if (this.nuevaFechaForm.invalid) return;

    const { fecha, hora } = this.nuevaFechaForm.value;

    this.fechas.push(
      this.fb.group({
        fecha,
        hora,
      })
    );

    this.nuevaFechaForm.reset();
  }

  removeFecha(index: number): void {
    this.fechas.removeAt(index);
  }

  private buildLocalDateTime(fecha: Date, hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const dt = new Date(fecha);
    dt.setHours(h, m, 0, 0);
    return dt.toISOString().slice(0, 19);
  }

  onSubmit(): void {
    if (this.membresiaForm.invalid) return;

    const value = this.membresiaForm.value;

    const fechas = value.fechas!.map((f: any) => this.buildLocalDateTime(f.fecha, f.hora));

    const dto = {
      nombre: value.nombre!,
      descripcion: value.descripcion!,
      capacidad: value.capacidad!,
      fechas,
    };

    const request = this.claseId
      ? this.claseService.updateSpecific({ id: this.claseId, ...dto })
      : this.claseService.saveSpecific(dto);

    request.subscribe({
      next: () => {
        this.alert.success(this.claseId ? 'Clase actualizada' : 'Clase creada');
        this.router.navigateByUrl('pages/clase');
      },
      error: (err) => {
        this.alert.errorResponse(err, 'Error al guardar clase');
        console.error(err);
      },
    });
  }
}
