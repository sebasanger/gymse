import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { ProgresoRutinaService } from '../../services/progreso-rutina-service';
import { MembresiaUsuarioService } from '../../services/membresia-usuario-service';

@Component({
  selector: 'app-check-in-out',
  standalone: true,
  templateUrl: './check-in-out.component.html',
  styleUrls: ['./check-in-out.component.scss'],
  imports: [CommonModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule],
})
export class CheckInOutComponent {
  checkForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private progresoRutinaService: ProgresoRutinaService,
    private membresiaUsuarioService: MembresiaUsuarioService
  ) {
    this.checkForm = this.fb.group({
      documento: ['', Validators.required],
    });
  }

  onCheckIn() {
    const documento = this.checkForm.value.documento;
    if (!documento) return;

    this.checkForm.reset();

    this.progresoRutinaService.checkIn(documento).subscribe({
      next: () => this.handleCheckInSuccess(documento),
      error: (err) => this.showError('Error en Check-In', err),
    });
  }

  onCheckOut() {
    const documento = this.checkForm.value.documento;
    if (!documento) return;

    this.checkForm.reset();

    this.progresoRutinaService.checkOut(documento).subscribe({
      next: () =>
        this.showSuccess(
          '👋 Check-Out realizado',
          'Tu salida ha sido registrada correctamente. ¡Nos vemos pronto!'
        ),
      error: (err) => this.showError('Error en Check-Out', err),
    });
  }

  private handleCheckInSuccess(documento: string) {
    this.membresiaUsuarioService.getMembresiaUsuarioByDocument(documento).subscribe({
      next: (membresiaUsuario) => {
        if (!membresiaUsuario) {
          this.showError('Sin membresía activa', {
            error: { message: 'El usuario no posee una membresía activa o está vencida.' },
          });
          return;
        }

        const usuario = membresiaUsuario.usuario;
        const membresia = membresiaUsuario.membresia;

        this.showSuccess(
          '✅ Check-In Exitoso',
          `
          <div style="text-align: left;">
            <strong>Usuario:</strong> ${usuario.fullName}<br>
            <strong>Documento:</strong> ${usuario.documento}<br>
            <strong>Membresía:</strong> ${membresia.nombre}<br>
            <strong>Precio:</strong> $${membresia.precio}<br>
            <strong>Vence el:</strong> ${new Date(
              membresiaUsuario.fechaVencimiento
            ).toLocaleDateString()}<br><br>
            <em>Podés seleccionar una rutina desde tu teléfono.</em>
          </div>
        `
        );
      },
      error: (err) => {
        this.showError('Error al obtener membresía', err);
      },
    });
  }

  private showSuccess(title: string, html: string) {
    Swal.fire({
      title,
      html,
      icon: 'success',
      background: '#1e293b',
      color: '#fff',
      timer: 10000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  private showError(title: string, err: any) {
    Swal.fire({
      title: `❌ ${title}`,
      text:
        err?.error?.message ||
        'Ocurrió un error inesperado. Verificá el documento o el estado de la membresía.',
      icon: 'error',
      background: '#1e293b',
      color: '#fff',
      timer: 10000,
      showConfirmButton: false,
    });
  }
}
