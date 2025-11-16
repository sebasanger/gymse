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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { RutinaService } from '../../../services/rutina-service';
import { ProgresoRutina } from '../../../interfaces/progresoRutina/progreso-rutina..interface';
import { ProgresoRutinaService } from '../../../services/progreso-rutina-service';

@Component({
  selector: 'app-progresos-rutinas',
  templateUrl: './progresos-rutinas.component.html',
  styleUrls: ['./progresos-rutinas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
})
export class ProgresosRutinasComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProgresoRutina>;

  dataSource = new MatTableDataSource<ProgresoRutina>();
  progresos: ProgresoRutina[] = [];
  expandedProgreso: ProgresoRutina | null = null;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  private readonly progresoRutinaService = inject(ProgresoRutinaService);

  columnsToDisplay = ['id', 'rutina', 'entrenamiento', 'fecha', 'checkIn', 'checkOut', 'duracion'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.progresoRutinaService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((progresos) => {
        this.progresos = progresos;
        this.dataSource.data = progresos;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  isExpanded(element: ProgresoRutina) {
    return this.expandedProgreso === element;
  }

  toggle(element: ProgresoRutina) {
    this.expandedProgreso = this.isExpanded(element) ? null : element;
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: ProgresoRutina, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();
      return (
        data.rutina.nombre.toLowerCase().includes(normalizedFilter) ||
        data.entrenamiento.nombre.toLowerCase().includes(normalizedFilter)
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

  getDuracionMinutes(row: ProgresoRutina) {
    if (!row?.checkIn || !row?.checkOut) return null;
    const diffMs = new Date(row.checkOut).getTime() - new Date(row.checkIn).getTime();
    return Math.round(diffMs / 60000); // minutos
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
