import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
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
import { Ejercicio } from '../../interfaces/ejercicio/ejercicio.interface';
import { AlertService } from '../../services/alert-service';
import { EjercicioService } from '../../services/ejercicio-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-ejercicios',
  templateUrl: './ejercicios.component.html',
  styleUrl: './ejercicios.component.scss',
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
export class EjerciciosComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Ejercicio>;
  dataSource = new MatTableDataSource<Ejercicio>();
  ejercicios: Ejercicio[] = [];
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly ejercicioService = inject(EjercicioService);
  public categorias: Map<number, string> = new Map();
  public includedDeleted: boolean = true;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nombre', 'categoria', 'edit', 'delete'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.ejercicioService
      .findAllIncludingDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ejercicios) => {
        this.ejercicios = ejercicios;
        ejercicios.forEach((ejercicio) => {
          this.categorias.set(ejercicio.categoria.id, ejercicio.categoria.categoria);
        });
        this.dataSource.data = ejercicios;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Ejercicio, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      const nombre = data.nombre?.toLowerCase() ?? '';
      const id = String(data.id ?? '').toLowerCase();
      const categoria = data.categoria?.categoria?.toLowerCase() ?? '';

      return (
        nombre.includes(normalizedFilter) ||
        id.includes(normalizedFilter) ||
        categoria.includes(normalizedFilter)
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
      this.dataSource.data = this.ejercicios;
    } else {
      this.dataSource.data = this.ejercicios.filter((e) => !e.deleted);
    }
    this.cdr.detectChanges();
  }

  applyFilterByCategory(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNewEjercicio() {
    this.router.navigateByUrl('pages/ejercicios/create');
  }

  editEjercicio(userid: number) {
    this.router.navigateByUrl('pages/ejercicios/update/' + userid);
  }

  delete(id: number) {
    this.alert.confirmDelete('Deshabilitar ejercicio?', 'Podras revertir esto.').then((result) => {
      if (result.isConfirmed) {
        this.ejercicioService.deleteById(id).subscribe({
          next: () => {
            this.alert.success(
              'Ejercicio deshabilitado',
              'El ejercicio fue deshabilitado correctamente.'
            );
            this.dataSource.data = this.dataSource.data.filter((c) => c.id !== id);
          },
          error: (err) => {
            console.error(err);
            this.alert.error('Error', 'No se pudo deshabilitar el ejercicio.');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se deshabilito.');
      }
    });
  }

  recover(id: number) {
    this.alert.confirmDelete('Deshabilitar ejercicio?', 'Podras revertir esto.').then((result) => {
      if (result.isConfirmed) {
        this.ejercicioService.deleteById(id).subscribe({
          next: () => {
            this.alert.success(
              'Ejercicio deshabilitado',
              'El ejercicio fue deshabilitado correctamente.'
            );
            this.dataSource.data = this.dataSource.data.filter((c) => c.id !== id);
          },
          error: (err) => {
            console.error(err);
            this.alert.error('Error', 'No se pudo deshabilitar el ejercicio.');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se deshabilito.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
