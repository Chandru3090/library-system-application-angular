import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() menus: any = [];
  authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  isUserInfoMenuvisible = false;

  logout() {
    this.authService.logout();
  }

  navigateToDashboard() {
    this.router.navigate(['/']);
  }

  toggleUserInfo() {
    this.isUserInfoMenuvisible = !this.isUserInfoMenuvisible;
  }
}
