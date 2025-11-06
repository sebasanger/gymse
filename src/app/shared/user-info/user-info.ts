import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service'; // ajustá el path según tu estructura

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
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

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    // según tu routing, por ejemplo:
    // this.router.navigate(['/perfil']);
    console.log('Ir al perfil');
  }
}
