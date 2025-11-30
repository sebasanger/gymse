import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../../services/alert-service';
import { MembresiaUsuario } from '../../../interfaces/membresiaUsuario/membresia-usuario.interface';
import { MembresiaUsuarioService } from '../../../services/membresia-usuario-service';
import { Router } from '@angular/router';
import { PagoService } from '../../../services/pago-service';
import { MatDialog } from '@angular/material/dialog';
import { DetallesMembresiaDialogComponent } from '../../membresias/gestion-membresia/detalles-membresia-dialog/detalles-membresia-dialog';

@Component({
  selector: 'app-pago-membresia',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './pago-membresia.html',
  styleUrls: ['./pago-membresia.scss'],
})
export class PagoMembresiaComponent implements OnInit {
  public membresiaUsuario: MembresiaUsuario | undefined;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);

  constructor(
    private alert: AlertService,
    private membresiaUsuarioService: MembresiaUsuarioService,
    private pagoService: PagoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.membresiaUsuarioService.getByCurrentUser().subscribe((res) => {
      this.membresiaUsuario = res;
      this.cdr.detectChanges();
    });
  }

  pagarMembresia() {
    if (!this.membresiaUsuario?.id) {
      this.alert.error('Error', 'No se encontró una membresía activa.');
      return;
    }

    this.alert
      .confirm('¿Deseas realizar el pago?', 'Se registrará un pago para esta membresía.', 'Pagar')
      .then((result) => {
        if (!result.isConfirmed) return;
        if (!this.membresiaUsuario?.id) return;

        this.pagoService
          .addPago({
            membresiaUsuarioId: this.membresiaUsuario.id,
            transaction: 'Transaction',
          })
          .subscribe({
            next: () => {
              this.alert.success('Pago realizado', 'El pago se registró correctamente.');
              this.load(); // refresca la data si querés
            },
            error: (err) => {
              this.alert.errorResponse(err, 'Error al registrar el pago');
            },
          });
      });
  }

  redirectSuscription() {
    this.router.navigateByUrl('pages/gestion/membresias');
  }

  verDetalles() {
    if (!this.membresiaUsuario) {
      return;
    }
    this.dialog.open(DetallesMembresiaDialogComponent, {
      width: '75vw',
      maxWidth: '900px',
      panelClass: 'membresia-detalle-dialog',
      data: this.membresiaUsuario,
    });
  }
}
