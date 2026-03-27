import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth';
import { IdleService } from '../../../core/services/idle';
@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {

  private authService = inject(AuthService);
  private idleService = inject(IdleService);
  private router      = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly userRole    = this.authService.userRole;

  logout(): void {
    this.idleService.stopWatching();
    this.authService.logout();
  }
}
