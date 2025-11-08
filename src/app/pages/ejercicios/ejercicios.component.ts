import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Ejercicio } from '../../interfaces/ejercicio/ejercicio.interface';
import { EjerciciosDataSource } from './ejercicios-datasource';
import { EjercicioService } from '../../services/ejercicio-service';

@Component({
  selector: 'app-ejercicios',
  templateUrl: './ejercicios.component.html',
  styleUrl: './ejercicios.component.scss',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
})
export class EjerciciosComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Ejercicio>;
  dataSource = new EjerciciosDataSource();
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  private readonly ejercicioService = inject(EjercicioService);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nombre', 'categoria'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.ejercicioService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ejercicios) => {
        this.dataSource.data = ejercicios ?? [];
        this.table.dataSource = this.dataSource;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
