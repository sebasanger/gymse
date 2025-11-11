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
import { Rutina } from '../../../interfaces/rutina/rutina.interface';
import { AlertService } from '../../../services/alert-service';
import { RutinaService } from '../../../services/rutina-service';
import { Entrenamiento } from '../../../interfaces/entrenamieto/entrenamiento.interface';
@Component({
  selector: 'app-seleccion-rutina',
  templateUrl: './seleccion-rutina.component.html',
  styleUrl: './seleccion-rutina.component.scss',
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
export class SeleccionRutinasComponent implements OnDestroy, AfterViewInit {
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
  expandedRutina: Rutina | null | undefined;
  selectedEntrenamiento: any | null = null;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columnsToDisplay = ['id', 'nombre', 'descripcion', 'edit'];
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
      .findByCurrentUser()
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEntrenamientoSelect(entrenamiento: Entrenamiento) {
    this.selectedEntrenamiento = entrenamiento;
    this.alert.success(`Entrenamiento "${entrenamiento.nombre}" seleccionado.`);
    console.log(entrenamiento);

    // Si queres actualizar el progreso en el backend:
    // this.progresoRutinaService.actualizar(this.expandedRutina!.id, entrenamiento.id).subscribe()
  }
}
