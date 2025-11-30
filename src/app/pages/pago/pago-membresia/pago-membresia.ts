import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../../services/alert-service';
import { MembresiaUsuario } from '../../../interfaces/membresiaUsuario/membresia-usuario.interface';
import { MembresiaUsuarioService } from '../../../services/membresia-usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-membresia',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './pago-membresia.html',
  styleUrls: ['./pago-membresia.scss'],
})
export class PagoMembresiaComponent implements OnInit {
  public membresiaUsuario: MembresiaUsuario | undefined;

  constructor(
    private alert: AlertService,
    private membresiaUsuarioService: MembresiaUsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.membresiaUsuarioService.getByCurrentUser().subscribe((res) => {
      console.log('ACA');

      this.membresiaUsuario = res;

      console.log(this.membresiaUsuario);
    });
  }

  pagarMembresia() {
    this.alert
      .confirm('¿Deseas realizar el pago?', 'Se registrará un pago para esta membresía.', 'Pagar')
      .then((result) => {
        if (result.isConfirmed) {
          // Ejemplo de pago
          // this.service.pagar(this.data.id).subscribe(...)

          this.alert.success('Pago realizado', 'El pago se registró correctamente.');
        }
      });
  }

  redirectSuscription() {
    this.router.navigateByUrl('pages/gestion/membresias');
  }
}
