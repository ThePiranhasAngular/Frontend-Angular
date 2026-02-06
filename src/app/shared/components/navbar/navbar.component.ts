import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="navbar-brand">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="brand-text">RestorApp</span>
        </a>

        <!-- Navigation Links -->
        <div class="navbar-menu">
          @if (authService.userRole() === 'USER') {
            <a routerLink="/menu" routerLinkActive="active" class="nav-link">Menu</a>
            <a routerLink="/orders" routerLinkActive="active" class="nav-link">My Orders</a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-link">Profile</a>
          } @else if (authService.userRole() === 'ADMIN') {
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            <a routerLink="/admin/products" routerLinkActive="active" class="nav-link">Menu</a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">Users</a>
          }
        </div>

        <!-- Right Side -->
        <div class="navbar-actions">
          <!-- User Avatar -->
          <div class="user-menu">
            <div class="avatar">
              <img src="https://ui-avatars.com/api/?name={{ authService.currentUser()?.name }}&background=22C55E&color=fff" alt="Avatar">
            </div>
            <button class="logout-btn" (click)="logout()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      background: var(--white);
      border-bottom: 1px solid var(--gray-200);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
      height: 64px;
      display: flex;
      align-items: center;
      /* removed justify-content: space-between to allow margin-auto to work */
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      text-decoration: none;
      color: var(--gray-900);
    }

    /* ... */

    .navbar-menu {
      display: flex;
      gap: 24px;
      margin-left: auto;
      margin-right: 0; /* Removed space completely to bring adjacent to actions */
      align-self: stretch; /* Stretch to fill container height */
    }

    .nav-link {
      padding: 0 var(--spacing-md); /* Remove top/bottom padding since we center differently */
      color: #6B7280;
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      position: relative;
      transition: color 0.2s;
      display: flex;
      align-items: center; /* Center text vertically */
      height: 100%; /* Fill navbar menu height */
    }

    .nav-link:hover {
      color: #111827;
      background: transparent;
    }

    .nav-link.active {
      color: #111827;
      background: transparent;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0; /* Sticks exactly to the bottom edge */
      left: 0;
      right: 0;
      height: 2px;
      background: #22C55E;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .cart-button {
      position: relative;
      padding: var(--spacing-sm);
      background: transparent;
      border: none;
      color: var(--gray-600);
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .cart-button:hover {
      background: var(--gray-100);
      color: var(--gray-900);
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;
      width: 18px;
      height: 18px;
      background: var(--primary-green);
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background: transparent;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      color: var(--gray-600);
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: var(--gray-100);
      color: var(--gray-900);
    }
  `]
})
export class NavbarComponent {
    authService = inject(AuthService);
    cartService = inject(CartService);
    private router = inject(Router);

    toggleCart(): void {
        // Emit event or navigate to cart
    }

    logout(): void {
        this.authService.logout();
    }
}
