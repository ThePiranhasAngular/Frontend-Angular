import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="admin-header">
      <div class="header-brand">
        <div class="brand-logomark">
          <div class="triangle"></div>
        </div>
        <span class="brand-text">RestorApp Admin</span>
      </div>

      <nav class="header-nav">
        <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Dashboard</a>
        <a routerLink="/admin/products" routerLinkActive="active" class="nav-link">Menu</a>
        <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">Users</a>
      </nav>

      <div class="header-actions">
        <button class="logout-btn" (click)="logout()">
          Log Out
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
        <div class="avatar-circle">
          <img [src]="'https://ui-avatars.com/api/?name=' + authService.currentUser()?.name + '&background=fde68a&color=d97706'" alt="Avatar">
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Header */
    .admin-header {
      background: var(--white);
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      border-bottom: 1px solid #E5E7EB;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logomark {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .triangle {
       width: 0; 
       height: 0; 
       border-left: 10px solid transparent;
       border-right: 10px solid transparent;
       border-bottom: 20px solid #22C55E;
    }

    .brand-text {
      font-weight: 700;
      font-size: 18px;
      color: #111827;
    }

    .header-nav {
      display: flex;
      gap: 24px;
    }

    .nav-link {
      color: #6B7280;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      cursor: pointer;
    }

    .nav-link.active {
      color: #111827;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -22px; /* Center in header height which is 64px */
      left: 0;
      width: 100%;
      height: 2px;
      background: #22C55E;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: transparent;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #6B7280;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #F9FAFB;
      color: #EF4444;
      border-color: #EF4444;
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
  `]
})
export class AdminNavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
