import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
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
import { Usuario } from '../../interfaces/user/usuario.interface';
import { AlertService } from '../../services/alert-service';
import { UserService } from '../../services/user.service';
import { Role, ROLES } from '../../interfaces/roles/roles.enum';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
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
export class UsuariosComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource = new MatTableDataSource<Usuario>();
  usuarios: Usuario[] = [];
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly usuarioService = inject(UserService);
  public membresias: Map<number, string> = new Map();
  public includedDeleted: boolean = true;
  public roles: Role[] = ROLES;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'fullName', 'email', 'edit', 'delete'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.usuarioService
      .findAllIncludingDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuarios) => {
        this.usuarios = usuarios;
        this.dataSource.data = usuarios;
        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      const nombre = data.fullName?.toLowerCase() ?? '';

      const id = String(data.id ?? '').toLowerCase();

      const rol: boolean = data.roles.some((r) => r.rol == (filter.toUpperCase() as Role));

      return nombre.includes(normalizedFilter) || id.includes(normalizedFilter) || rol;
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
      this.dataSource.data = this.usuarios;
    } else {
      this.dataSource.data = this.usuarios.filter((e) => !e.deleted);
    }
    this.cdr.detectChanges();
  }

  applyFilterByRol(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create() {
    this.router.navigateByUrl('pages/usuarios/create');
  }

  edit(userid: number) {
    this.router.navigateByUrl('pages/usuarios/update/' + userid);
  }

  delete(id: number) {
    this.alert.confirmDelete('Deshabilitar usuario?').then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteById(id).subscribe({
          next: () => {
            this.alert.success(
              'Usuario deshabilitado',
              'El usuario fue deshabilitado correctamente.'
            );
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse(err, 'No se pudo deshabilitar el usuario');
          },
        });
      } else {
        this.alert.warning('Cancelado', 'No se deshabilito.');
      }
    });
  }

  recover(id: number) {
    this.alert.confirmRecover('Habilitar usuario?').then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.recoverById(id).subscribe({
          next: () => {
            this.alert.success('Usuario habilitado', 'El usuario fue habilitado correctamente.');
            this.load();
          },
          error: (err) => {
            console.error(err);
            this.alert.errorResponse(err, 'No se pudo habilitar el usuario');
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
