import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UsersDataSource } from './users-datasource';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<User>;
  dataSource = new UsersDataSource();
  private readonly userService = inject(UserService);
  private readonly destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns = ['id', 'fullName'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.dataSource.data = users ?? [];
        this.table.dataSource = this.dataSource;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
