import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../services/alert-service';
import { MembresiaService } from '../../services/membresia-service';
import { Membresia } from '../../interfaces/membresia/membresia.interface';
import { Pago } from '../../interfaces/pago/pago.interface';
import { PagoService } from '../../services/pago-service';
@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
  ],
})
export class PagosComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Pago>;
  dataSource = new MatTableDataSource<Pago>();
  pagos: Pago[] = [];
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly pagoService = inject(PagoService);
  public includedDeleted: boolean = true;
  expandedMembresia: Membresia | null | undefined;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columnsToDisplay = ['id', 'monto', 'descripcion', 'cliente', 'fecha', 'aceptado', 'delete'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.pagoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pagos) => {
        this.pagos = pagos;
        this.dataSource.data = pagos;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Pago, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      const precio = data.monto ?? '';
      const descripcion = data.descripcion?.toLowerCase() ?? '';
      const id = String(data.id ?? '').toLowerCase();

      return (
        descripcion.includes(normalizedFilter) ||
        id.includes(normalizedFilter) ||
        precio.toString().includes(normalizedFilter)
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterByCategory(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  add() {
    this.router.navigateByUrl('pages/membresias/create');
  }

  edit(userid: number) {
    this.router.navigateByUrl('pages/membresias/update/' + userid);
  }

  delete(id: number) {
    this.alert.confirmDelete('Eliminar pago?').then((result) => {
      if (result.isConfirmed) {
        this.pagoService.deleteById(id).subscribe({
          next: () => {
            this.alert.success('Pago eliminado', 'El pago fue eliminado correctamente.');
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse('Error', 'No se pudo eliminar el pago.');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se elimino.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
