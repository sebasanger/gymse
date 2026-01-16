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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioConMembresia } from '../../interfaces/clientes/cliente.interface';
import { AlertService } from '../../services/alert-service';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { UserService } from '../../services/user.service';
import { Clase } from '../../interfaces/clases/clase.interface';
import { ClaseService } from '../../services/clase-service';
@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss',
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
    MatTooltipModule,
  ],
})
export class ClasesComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Clase>;
  dataSource = new MatTableDataSource<Clase>();
  clases: Clase[] = [];
  private readonly alert = inject(AlertService);
  private readonly claseService = inject(ClaseService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  private readonly dialog = inject(MatDialog);

  displayedColumns = ['id', 'nombre', 'descripcion', 'capacidad', 'fechas', 'edit', 'delete'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.claseService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clases) => {
        this.clases = clases;
        this.dataSource.data = clases;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Clase, filter: string) => {
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

  create() {
    this.router.navigateByUrl('pages/clase/create');
  }

  edit(claseId: number) {
    this.router.navigateByUrl('pages/clase/update/' + claseId);
  }

  delete(id: number) {
    this.alert.confirmDelete('Deshabilitar cliente?').then((result) => {
      if (result.isConfirmed) {
        this.claseService.deleteById(id).subscribe({
          next: () => {
            this.alert.success(
              'Cliente deshabilitado',
              'El cliente fue deshabilitado correctamente.'
            );
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse(err, 'No se pudo deshabilitar el cliente');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se deshabilito.');
      }
    });
  }

  recover(id: number) {
    this.alert.confirmRecover('Habilitar cliente?').then((result) => {
      if (result.isConfirmed) {
        this.claseService.recoverById(id).subscribe({
          next: () => {
            this.alert.success('Cliente habilitado', 'El cliente fue habilitado correctamente.');
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse(err, 'No se pudo habilitar el cliente');
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
