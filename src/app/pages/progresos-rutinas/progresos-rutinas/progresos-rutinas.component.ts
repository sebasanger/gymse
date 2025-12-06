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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import {
  ProgresoRutina,
  ProgresoRutinaConProgreso,
} from '../../../interfaces/progresoRutina/progreso-rutina..interface';
import { ProgresoRutinaService } from '../../../services/progreso-rutina-service';
import { Rutina } from '../../../interfaces/rutina/rutina.interface';
import { MatSelectModule } from '@angular/material/select';

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
    MatCardModule,
    MatSelectModule,
  ],
})
export class ProgresosRutinasComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProgresoRutinaConProgreso>;

  dataSource = new MatTableDataSource<ProgresoRutinaConProgreso>();
  progresos: ProgresoRutinaConProgreso[] = [];
  expandedProgreso: ProgresoRutinaConProgreso | null = null;

  rutinas: Set<Rutina> = new Set<Rutina>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  private readonly progresoRutinaService = inject(ProgresoRutinaService);

  columnsToDisplay = ['id', 'rutina', 'entrenamiento', 'fecha', 'checkIn', 'checkOut', 'duracion'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    const sortState: Sort = { active: 'id', direction: 'desc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.load();
  }

  load() {
    this.progresoRutinaService
      .getAllOwnProgressRoutine()
      .pipe(takeUntil(this.destroy$))
      .subscribe((progresos) => {
        progresos.forEach((progreso) => {
          const exists = [...this.rutinas].some((r) => r.id === progreso.rutina.id);

          if (!exists) {
            this.rutinas.add(progreso.rutina);
          }
        });

        this.progresos = progresos;
        console.log(this.progresos);

        this.dataSource.data = progresos;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  applyFilterByRutina(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isExpanded(element: ProgresoRutinaConProgreso) {
    return this.expandedProgreso === element;
  }

  toggle(element: ProgresoRutinaConProgreso) {
    this.expandedProgreso = this.isExpanded(element) ? null : element;
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: ProgresoRutinaConProgreso, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();
      return data.rutina.nombre.toLowerCase().includes(normalizedFilter);
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
