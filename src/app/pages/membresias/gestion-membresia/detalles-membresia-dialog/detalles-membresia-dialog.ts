import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PagoService } from '../../../../services/pago-service';
import { MembresiaUsuario } from '../../../../interfaces/membresiaUsuario/membresia-usuario.interface';
import { Pago } from '../../../../interfaces/pago/pago.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detalles-membresia-dialog',
  imports: [CommonModule, MatDialogModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './detalles-membresia-dialog.html',
  styleUrl: './detalles-membresia-dialog.scss',
})
export class DetallesMembresiaDialogComponent implements OnInit {
  public pagos: Pago[] | undefined;
  constructor(
    public dialogRef: MatDialogRef<DetallesMembresiaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MembresiaUsuario,
    private pagoService: PagoService
  ) {}

  displayedColumnsPagos: string[] = ['fecha', 'monto', 'transaction', 'aceptada', 'descripcion'];

  ngOnInit(): void {
    this.pagoService.getAllByMembresiaUsuarioId(this.data.id).subscribe((res) => {
      this.pagos = res;
    });
  }
}
