import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h1>SnacksControl</h1>
      </div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a (click)="navigateToAdmin('reuniones')" [class.active]="isAdminRoute('reuniones')">Reuniones</a>
        <a (click)="navigateToAdmin('productos')" [class.active]="isAdminRoute('productos')">Productos</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #343a40;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
      cursor: pointer;
    }
    .nav-links a:hover,
    .nav-links a.active {
      background-color: #495057;
    }
  `]
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToAdmin(section: string) {
    this.authService.resetAdmin();
    if (this.authService.checkAdminPassword()) {
      this.router.navigate([`/admin/${section}`]);
    }
  }

  isAdminRoute(section: string): boolean {
    return this.router.url === `/admin/${section}`;
  }
}