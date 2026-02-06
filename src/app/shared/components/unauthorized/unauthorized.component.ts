import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <a routerLink="/" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `,
    styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-50);
      padding: var(--spacing-md);
    }

    .unauthorized-card {
      text-align: center;
      background: var(--white);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      max-width: 400px;
    }

    .icon {
      color: var(--status-cancelled);
      margin-bottom: var(--spacing-lg);
    }

    h1 {
      margin: 0 0 var(--spacing-sm);
      font-size: 1.5rem;
    }

    p {
      color: var(--gray-500);
      margin-bottom: var(--spacing-lg);
    }
  `]
})
export class UnauthorizedComponent { }
