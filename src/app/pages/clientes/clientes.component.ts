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
import { UsuarioConMembresia } from '../../interfaces/user/usuario.interface';
import { AlertService } from '../../services/alert-service';
import { ClienteService } from '../../services/cliente.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
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
export class ClientesComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<UsuarioConMembresia>;
  dataSource = new MatTableDataSource<UsuarioConMembresia>();
  usuarios: UsuarioConMembresia[] = [];
  private readonly alert = inject(AlertService);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly clienteService = inject(ClienteService);
  public membresias: Map<number, string> = new Map();
  public includedDeleted: boolean = true;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'fullName', 'email', 'edit', 'delete'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.clienteService
      .findAllClientes(true)
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
    this.dataSource.filterPredicate = (data: UsuarioConMembresia, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      const nombre = data.fullName?.toLowerCase() ?? '';

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
    this.router.navigateByUrl('pages/clientes/create');
  }

  edit(userid: number) {
    this.router.navigateByUrl('pages/clientes/update/' + userid);
  }

  delete(id: number) {
    this.alert.confirmDelete('Deshabilitar cliente?').then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteById(id).subscribe({
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
        this.userService.recoverById(id).subscribe({
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

  isMembresiaValida(row: any): boolean {
    if (!row.membresiaActiva) return false;
    const hoy = new Date();
    const fechaVencimiento = new Date(row.membresiaActiva.fechaVencimiento);
    return fechaVencimiento > hoy;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
