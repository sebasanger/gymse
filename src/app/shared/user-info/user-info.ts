import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service'; // ajustá el path según tu estructura
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
})
export class UserInfo implements OnInit {
  user = signal<User | null>(null);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // si los datos del usuario están en el token o guardados en localStorage
    this.authService.getAuthenticatedUser().subscribe({
      next: (res) => this.user.set(res),
      error: () => this.user.set(null),
    });
  }
}
