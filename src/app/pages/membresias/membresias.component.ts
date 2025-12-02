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
@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.scss',
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
export class MembresiasComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Membresia>;
  dataSource = new MatTableDataSource<Membresia>();
  membresias: Membresia[] = [];
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly membresiaService = inject(MembresiaService);
  public includedDeleted: boolean = true;
  expandedMembresia: Membresia | null | undefined;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columnsToDisplay = [
    'id',
    'nombre',
    'descripcion',
    'precio',
    'cantidadDias',
    'cantidadClases',
    'edit',
    'delete',
  ];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.membresiaService
      .findAllIncludingDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((membresias) => {
        this.membresias = membresias;

        this.dataSource.data = membresias;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Membresia, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      const precio = data.precio ?? '';
      const nombre = data.nombre?.toLowerCase() ?? '';
      const id = String(data.id ?? '').toLowerCase();

      return (
        nombre.includes(normalizedFilter) ||
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

  toggleIncludeDeleted(): void {
    if (this.includedDeleted) {
      this.dataSource.data = this.membresias;
    } else {
      this.dataSource.data = this.membresias.filter((e) => !e.deleted);
    }
    this.cdr.detectChanges();
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
    this.alert.confirmDelete('Deshabilitar membresia?').then((result) => {
      if (result.isConfirmed) {
        this.membresiaService.deleteById(id).subscribe({
          next: () => {
            this.alert.success(
              'Membresia deshabilitada',
              'La membresia fue deshabilitada correctamente.'
            );
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse('Error', 'No se pudo deshabilitar la membresia.');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se deshabilito.');
      }
    });
  }

  recover(id: number) {
    this.alert.confirmRecover('Habilitar membresia?').then((result) => {
      if (result.isConfirmed) {
        this.membresiaService.recoverById(id).subscribe({
          next: () => {
            this.alert.success(
              'Membresia habilitada',
              'La membresia fue habilitada correctamente.'
            );
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse('Error', 'No se pudo habilitar la membresia.');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se habilito.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
