import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PagoService } from '../../../../services/pago-service';
import { MembresiaUsuario } from '../../../../interfaces/membresiaUsuario/membresia-usuario.interface';
import { Pago } from '../../../../interfaces/pago/pago.interface';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-detalles-membresia-dialog',
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
  templateUrl: './detalles-membresia-dialog.html',
  styleUrl: './detalles-membresia-dialog.scss',
})
export class DetallesMembresiaDialogComponent implements OnDestroy, AfterViewInit {
  public pagos: Pago[] | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Pago>;
  dataSource = new MatTableDataSource<Pago>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<DetallesMembresiaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MembresiaUsuario,
    private pagoService: PagoService
  ) {}

  displayedColumnsPagos: string[] = ['fecha', 'monto', 'transaction', 'aceptada', 'descripcion'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.pagoService
      .getAllByMembresiaUsuarioId(this.data.id)
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
}
