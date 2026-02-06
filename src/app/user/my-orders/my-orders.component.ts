import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, StatusBadgeComponent],
  template: `
    <div class="page-container">
      <app-navbar />
      
      <main class="main-content">
        <div class="orders-container">
          <!-- Orders Section -->
          <section class="orders-section">
            <div class="section-header">
              <h1>Recent Orders</h1>
              <a href="#" class="view-all">View All</a>
            </div>

            <div class="orders-list">
              @if (isLoading()) {
                @for (i of [1,2,3]; track i) {
                  <div class="order-card skeleton">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                  </div>
                }
              } @else if (orders().length === 0) {
                <div class="empty-orders">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                    <line x1="9" y1="12" x2="15" y2="12"/>
                    <line x1="9" y1="16" x2="15" y2="16"/>
                  </svg>
                  <h3>No orders yet</h3>
                  <p>Your order history will appear here</p>
                  <a routerLink="/menu" class="btn btn-primary">Browse Menu</a>
                </div>
              } @else {
                @for (order of orders(); track order.id) {
                  <div class="order-card">
                    <div class="order-icon" [ngClass]="getOrderIconClass(order.status)">
                      @if (order.status === 'DELIVERED') {
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                      } @else if (order.status === 'PREPARING') {
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M2 15h20"></path>
                          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"></path>
                          <path d="M18 5v6"></path>
                          <path d="M5 6l2-1 2 1 2-1 2 1 2-1 2 1 2-1"></path>
                         <line x1="8" y1="3" x2="8" y2="5"></line>
                         <line x1="12" y1="3" x2="12" y2="5"></line>
                         <line x1="16" y1="3" x2="16" y2="5"></line>
                        </svg>
                      } @else if (order.status === 'CANCELLED') {
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      } @else {
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                           <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      }
                    </div>
                    
                    <div class="order-info">
                      <h3>#{{ order.id.replace('ORD-', '') }}</h3> <!-- Simpler ID display -->
                      <span class="order-date">{{ order.createdAt | date:'MMM d, yyyy' }} • {{ order.items?.length || 0 }} {{ (order.items?.length === 1) ? 'Item' : 'Items' }}</span>
                    </div>

                    <div class="order-meta">
                         <div class="order-price">
                           \${{ order.total.toFixed(2) }}
                         </div>
                         <span class="status-pill" [ngClass]="order.status?.toLowerCase()">
                           {{ order.status | titlecase }}
                         </span>
                    </div>

                    <!-- Only show actions for first item or specific logic if needed, for now all have actions but hidden/shown on hover or layout -->
                    <div class="order-actions-overlay">
                        <a [routerLink]="['/orders', order.id]" class="btn-text">View Details</a>
                    </div>
                  </div>
                }
              }
            </div>
          </section>

          <!-- Profile Section -->
          <aside class="profile-section">
            <h2 class="section-title">Account Details</h2>
            <div class="profile-card">
              
              <div class="profile-header">
                <div class="avatar-wrapper">
                    <img 
                    [src]="'https://ui-avatars.com/api/?name=' + authService.currentUser()?.name + '&background=ffdfd4&color=f97316&size=128'" 
                    alt="Avatar"
                    class="profile-avatar"
                    >
                    <!-- Using orange/warm tones for avatar background based on image -->
                    <div class="edit-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </div>
                </div>
                <h3>{{ authService.currentUser()?.name || 'Alex Student' }}</h3>
                <p class="email">{{ authService.currentUser()?.email || 'alex.dev@university.edu' }}</p>
                <span class="role-badge">Customer</span>
              </div>

              <div class="profile-stats">
                <div class="stat-container">
                    <span class="stat-label">TOTAL ORDERS</span>
                    <span class="stat-value">12</span>
                </div>
                <div class="stat-container">
                    <span class="stat-label">LOYALTY PTS</span>
                    <span class="stat-value text-green">450</span>
                </div>
              </div>

              <div class="profile-menu">
                <a href="#" class="menu-item">
                  <div class="menu-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <span>Payment Methods</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
                <a href="#" class="menu-item">
                  <div class="menu-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <span>Saved Addresses</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
                <a href="#" class="menu-item">
                   <div class="menu-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </div>
                  <span>Preferences</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              </div>
            </div>

             <div class="footer-note">
                <p>RestorApp Academic Simulation V1.0</p>
                <p>Performance monitoring active.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: #F9FAFB;
      padding-bottom: 40px;
    }

    .main-content {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .orders-container {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 32px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
    }
    
    .section-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #111827;
        margin: 0 0 24px 0;
        letter-spacing: -0.025em;
    }

    .view-all {
      font-size: 0.875rem;
      color: #6B7280;
      font-weight: 500;
      text-decoration: none;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-card {
      display: flex;
      align-items: center;
      gap: 20px;
      background: var(--white);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Very subtle shadow */
      border: 1px solid #E5E7EB; /* Subtle border */
      transition: all 0.2s;
      position: relative;
    }
    
    .order-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .order-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .icon-green { background: #DCFCE7; color: #16A34A; }
    .icon-orange { background: #FEF3C7; color: #D97706; }
    .icon-red { background: #FEE2E2; color: #EF4444; }
    .icon-gray { background: #F3F4F6; color: #6B7280; }

    .order-info {
      flex: 1;
    }

    .order-info h3 {
      margin: 0 0 4px;
      font-size: 1rem;
      font-weight: 800;
      color: #111827;
    }

    .order-date {
      font-size: 0.8125rem;
      color: #6B7280;
      font-weight: 500;
    }

    .order-meta {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-right: 24px;
    }

    .order-price {
      font-weight: 800;
      color: #111827;
      font-size: 1rem;
    }
    
    .status-pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: capitalize;
    }
    
    .status-pill.delivered { background: #DCFCE7; color: #16A34A; }
    .status-pill.preparing { background: #FEF3C7; color: #B45309; }
    .status-pill.cancelled { background: #FEE2E2; color: #EF4444; }

    .order-actions-overlay {
        position: absolute;
        right: 24px;
        bottom: 24px; 
        display: none; /* Hidden by default, or maybe show on hover? The design shows buttons. Let's make them appear on hover or be part of the layout. The design shows buttons on one card. */
        gap: 12px;
        background: white;
    }
    
    /* Modify layout to include actions always or on hover? 
       The design shows the top card has "Reorder" button. Let's assume on hover or selection. 
       Actually let's put them on the right, but only visible on hover to keep clean look? 
       Or maybe the design implies expandable cards. 
       Let's stick to a clean row layout where buttons appear or are placed nicely.
       For now, let's keep the price and status visible, and maybe actions are secondary. 
    */
    
    .order-card:hover .order-actions-overlay {
        display: flex; /* Simplification */
    }
    
    /* Better approach for actions: Keep them hidden and show "View Receipt" textlink on hover? 
       Let's follow the image: Top card has "View Receipt" (text) and "Reorder" (Green Button).
       Let's make the card height consistent and show actions.
    */
    .order-actions-overlay {
        display: none;
    }
    .order-card:first-child .order-actions-overlay {
        display: flex;
        position: static;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        margin-left: 20px;
    }
    
    .btn-text {
        background: none; border: none; color: #6B7280; font-size: 0.75rem; font-weight: 600; cursor: pointer;
    }
    .btn-reorder {
        background: #22C55E; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 0.8125rem; cursor: pointer;
    }


    /* Profile Section */
    .profile-section {
    }

    .profile-card {
      background: var(--white);
      border-radius: 12px;
      padding: 0; /* Padding inside elements */
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Match order cards */
      border: 1px solid #E5E7EB;
      overflow: hidden;
    }

    .profile-header {
      padding: 32px 24px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .avatar-wrapper {
        position: relative;
        margin-bottom: 16px;
    }

    .profile-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 4px solid #F0FDF4; /* Light green ring */
    }
    
    .edit-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        background: #22C55E;
        color: white;
        width: 28px; height: 28px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid white;
    }

    .profile-header h3 {
      margin: 0 0 4px;
      font-size: 1.125rem;
      font-weight: 800;
      color: #111827;
    }

    .profile-header .email {
      margin: 0 0 12px;
      font-size: 0.8125rem;
      color: #6B7280;
    }
    
    .role-badge {
        background: #F3F4F6;
        color: #374151;
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 4px 12px;
        border-radius: 999px;
    }

    .profile-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 16px 24px;
      background: #F9FAFB;
      text-align: left;
      gap: 16px;
      border-top: 1px solid #F3F4F6;
      border-bottom: 1px solid #F3F4F6;
    }
    
    .stat-container {
        display: flex; flex-direction: column;
        background: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .stat-label {
      font-size: 0.625rem;
      font-weight: 700;
      color: #9CA3AF;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 800;
      color: #111827;
    }
    .text-green { color: #22C55E; }

    .profile-menu {
      padding: 16px 24px 24px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: #374151;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 8px;
      transition: background 0.2s;
      border: 1px solid #F3F4F6;
      margin-bottom: 8px;
    }

    .menu-item:hover {
      background: #F9FAFB;
      border-color: #E5E7EB;
    }
    
    .menu-icon {
        color: #6B7280;
        display: flex; align-items: center;
    }

    .menu-item .chevron {
      margin-left: auto;
      color: #D1D5DB;
    }

    .footer-note {
      text-align: center;
      font-size: 0.75rem;
      color: #9CA3AF;
      margin-top: 24px;
      line-height: 1.5;
      padding: 16px;
      background: #ECFDF5;
      border-radius: 8px;
      color: #065F46;
      font-weight: 500;
    }
    .footer-note p { margin: 0; }

    /* Skeleton */
    .order-card.skeleton {
      height: 88px;
    }

    .empty-orders {
      text-align: center;
      padding: 64px;
      color: #9CA3AF;
    }

    @media (max-width: 900px) {
      .orders-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        }
      });
    }
  }

  getOrderIconClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'icon-green';
      case 'PREPARING': return 'icon-orange';
      case 'CANCELLED': return 'icon-red';
      default: return 'icon-gray';
    }
  }
}
