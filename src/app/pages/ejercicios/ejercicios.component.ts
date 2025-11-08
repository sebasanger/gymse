import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Ejercicio } from '../../interfaces/ejercicio/ejercicio.interface';
import { EjercicioService } from '../../services/ejercicio-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Categoria } from '../../interfaces/categoria/categoria.interface';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

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
  ],
})
export class EjerciciosComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Ejercicio>;
  dataSource = new MatTableDataSource<Ejercicio>();
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly ejercicioService = inject(EjercicioService);
  public categorias: Map<number, string> = new Map();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nombre', 'categoria', 'edit', 'delete'];

  ngAfterViewInit(): void {
    this.ejercicioService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ejercicios) => {
        ejercicios.forEach((ejercicio) => {
          this.categorias.set(ejercicio.categoria.id, ejercicio.categoria.categoria);
        });
        this.dataSource.data = ejercicios;
        this.table.dataSource = this.dataSource;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Ejercicio, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();
      const categoriaNombre = data.categoria?.categoria?.toLowerCase() ?? '';

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
    console.log(event);

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

  addNewEjercicio() {
    this.router.navigateByUrl('pages/ejercicios/create');
  }

  editEjercicio(userid: number) {
    this.router.navigateByUrl('pages/ejercicios/update/' + userid);
  }

  deleteCustomer(id: number) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!',
    // }).then((result: any) => {
    //   if (result.isConfirmed) {
    //     this.customerService.delete(id);
    //     setTimeout(() => {
    //       this.loadCustomerPage();
    //     }, 500);
    //   } else {
    //     Swal.fire('Cancelled', 'the customer is safe', 'warning');
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
