import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioConMembresia } from '../../../interfaces/clientes/cliente.interface';
import { AddPagoDto, Pago } from '../../../interfaces/pago/pago.interface';
import { AlertService } from '../../../services/alert-service';
import { PagoService } from '../../../services/pago-service';

@Component({
  selector: 'app-detalles-membresia-pago-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './detalles-membresia-pago-dialog.html',
  styleUrl: './detalles-membresia-pago-dialog.scss',
})
export class DetallesMembresiaPagoDialogComponent implements OnDestroy, AfterViewInit {
  public pagos: Pago[] | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Pago>;
  dataSource = new MatTableDataSource<Pago>();

  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<DetallesMembresiaPagoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioConMembresia,
    private pagoService: PagoService
  ) {}

  displayedColumnsPagos: string[] = ['fecha', 'monto', 'transaction', 'aceptada', 'descripcion'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    const membresiaUsuarioId: number | undefined = this.data.membresiaActiva?.membresiaUsuarioId;
    if (!membresiaUsuarioId) {
      return;
    }

    this.pagoService
      .getAllByMembresiaUsuarioId(membresiaUsuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataSource.data = res;

        this.table.dataSource = this.dataSource;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pay() {
    const usuarioConMembresia: UsuarioConMembresia = this.data;
    console.log(usuarioConMembresia);
    if (!usuarioConMembresia.membresiaActiva) {
      return;
    }

    this.alert
      .confirm(
        'Realizar pago del cliente?',
        'Esta seguro de que quiere realizar el pago del cliente?'
      )
      .then((result) => {
        if (result.isConfirmed) {
          const addPagoDto: AddPagoDto = {
            membresiaUsuarioId: usuarioConMembresia.membresiaActiva?.membresiaUsuarioId ?? 0,
            transaction: 'internal',
          };
          this.pagoService.addPago(addPagoDto).subscribe({
            next: () => {
              this.alert.success('Pago realizado', 'El pago fue realizado correctamente.');
              this.load();
            },
            error: (err) => {
              console.error(err);
              this.alert.errorResponse(err, 'No se pudo realizar el pago');
            },
          });
        } else {
          this.alert.warning('Cancelado', 'No se realizo el pago.');
        }
      });
  }
}
