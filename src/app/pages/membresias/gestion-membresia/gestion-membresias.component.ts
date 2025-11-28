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
import { Membresia } from '../../../interfaces/membresia/membresia.interface';
import { AlertService } from '../../../services/alert-service';
import { MembresiaService } from '../../../services/membresia-service';
import { MembresiaUsuarioPair } from '../../../interfaces/membresiaUsuario/membresia-usuario.interface';
import { MembresiaUsuarioService } from '../../../services/membresia-usuario-service';
@Component({
  selector: 'app-gestion-membresias',
  templateUrl: './gestion-membresias.component.html',
  styleUrl: './gestion-membresias.component.scss',
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
export class GestionMembresiasComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MembresiaUsuarioPair>;
  dataSource = new MatTableDataSource<MembresiaUsuarioPair>();
  membresiaUsuarioPair: MembresiaUsuarioPair[] = [];
  private readonly alert = inject(AlertService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly membresiaUsuarioService = inject(MembresiaUsuarioService);
  public includedDeleted: boolean = true;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columnsToDisplay = [
    'id',
    'nombre',
    'descripcion',
    'precio',
    'cantidadClases',
    'fechaInscripcion',
    'fechaVencimiento',
    'fechaUltimoPago',
    'action',
  ];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.load();
  }

  load() {
    this.membresiaUsuarioService
      .getMembresiasByCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((membresiaUsuarioPair) => {
        this.membresiaUsuarioPair = membresiaUsuarioPair;
        this.dataSource.data = membresiaUsuarioPair;

        this.table.dataSource = this.dataSource;
        this.customFilters();
        this.cdr.detectChanges();
      });
  }

  customFilters() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  suscribir(id: number) {}
  desuscribir(id: number) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
