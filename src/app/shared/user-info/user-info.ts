import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
})
export class UserInfo {
  public readonly authService = inject(AuthService);
  public readonly router = inject(Router);
  user = this.authService.getUser();

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/pages/profile/update']);
  }

  goToChangePassword(): void {
    this.router.navigate(['/pages/password/update']);
  }
}
