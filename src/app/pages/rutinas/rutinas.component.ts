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
import { Rutina } from '../../interfaces/rutina/rutina.interface';
import { AlertService } from '../../services/alert-service';
import { RutinaService } from '../../services/rutina-service';
@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.component.html',
  styleUrl: './rutinas.component.scss',
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
export class RutinasComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Rutina>;
  dataSource = new MatTableDataSource<Rutina>();
  rutinas: Rutina[] = [];
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly rutinaService = inject(RutinaService);
  public includedDeleted: boolean = true;
  expandedRutina: Rutina | null | undefined;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columnsToDisplay = ['id', 'nombre', 'descripcion', 'edit', 'delete'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  /** Checks whether an element is expanded. */
  isExpanded(element: Rutina) {
    return this.expandedRutina === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: Rutina) {
    this.expandedRutina = this.isExpanded(element) ? null : element;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.rutinaService
      .findAllIncludingDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rutinas) => {
        this.rutinas = rutinas;

        this.dataSource.data = rutinas;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Rutina, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      const nombre = data.nombre?.toLowerCase() ?? '';
      const id = String(data.id ?? '').toLowerCase();

      return nombre.includes(normalizedFilter) || id.includes(normalizedFilter);
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
      this.dataSource.data = this.rutinas;
    } else {
      this.dataSource.data = this.rutinas.filter((e) => !e.deleted);
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
    this.router.navigateByUrl('pages/rutinas/create');
  }

  edit(userid: number) {
    this.router.navigateByUrl('pages/rutinas/update/' + userid);
  }

  delete(id: number) {
    this.alert.confirmDelete('Deshabilitar rutina?').then((result) => {
      if (result.isConfirmed) {
        this.rutinaService.deleteById(id).subscribe({
          next: () => {
            this.alert.success(
              'Rutina deshabilitada',
              'El rutina fue deshabilitada correctamente.'
            );
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse('Error', 'No se pudo deshabilitar la rutina.');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se deshabilito.');
      }
    });
  }

  recover(id: number) {
    this.alert.confirmRecover('Habilitar rutina?').then((result) => {
      if (result.isConfirmed) {
        this.rutinaService.recoverById(id).subscribe({
          next: () => {
            this.alert.success('Rutina habilitada', 'La rutina fue habilitada correctamente.');
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse('Error', 'No se pudo habilitar la rutina.');
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
