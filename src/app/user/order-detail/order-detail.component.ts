import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order, ORDER_STATUS_CONFIG } from '../../core/models';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar />
      <main class="main-content">
        @if (isLoading()) {
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Loading order details...</p>
          </div>
        } @else {
          @if (order(); as orderData) {
            <div class="order-detail-container">
              <header class="detail-header">
                <a routerLink="/orders" class="back-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to My Orders
                </a>
                <div class="header-main">
                  <h1>Order #{{ orderData.id.split('-')[0].toUpperCase() }}</h1>
                  <span class="status-badge" [ngClass]="getStatusClass(orderData.status)">
                    {{ orderData.status }}
                  </span>
                </div>
                <p class="order-date">Placed on {{ orderData.createdAt | date:'fullDate' }}</p>
              </header>

              <div class="detail-grid">
                <div class="items-card card">
                  <h3>Order Items</h3>
                  <div class="items-list">
                    @for (item of orderData.items; track item.id) {
                      <div class="item-row">
                        <div class="item-info">
                          <span class="item-name">{{ item.product?.name || 'Loading...' }}</span>
                          <span class="item-quantity">Qty: {{ item.quantity }}</span>
                        </div>
                        <span class="item-price">{{ item.price | currency }}</span>
                      </div>
                    }
                  </div>
                  <div class="total-row">
                    <span>Total Amount</span>
                    <span class="total-amount">{{ orderData.total | currency }}</span>
                  </div>
                </div>

                <div class="info-card card">
                  <h3>Customer Information</h3>
                  <div class="info-group">
                    <label>Order ID</label>
                    <span>{{ orderData.id }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </main>
    </div>
  `,
  styles: [`
    .page-container { min-height: 100vh; background: #F9FAFB; }
    .main-content { padding: 32px; max-width: 1000px; margin: 0 auto; }
    .detail-header { margin-bottom: 32px; }
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: #6B7280; text-decoration: none; font-weight: 500; margin-bottom: 24px; }
    .back-link:hover { color: #111827; }
    .header-main { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
    .header-main h1 { margin: 0; font-size: 2rem; font-weight: 800; color: #111827; }
    .order-date { color: #6B7280; font-size: 0.9375rem; margin: 0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
    .card { background: white; border-radius: 12px; border: 1px solid #E5E7EB; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .card h3 { margin: 0 0 20px; font-size: 1.125rem; font-weight: 700; color: #111827; }
    .items-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; border-bottom: 1px solid #F3F4F6; padding-bottom: 20px; }
    .item-row { display: flex; justify-content: space-between; align-items: center; }
    .item-info { display: flex; flex-direction: column; gap: 2px; }
    .item-name { font-weight: 600; color: #111827; }
    .item-quantity { font-size: 0.875rem; color: #6B7280; }
    .item-price { font-weight: 600; color: #111827; }
    .total-row { display: flex; justify-content: space-between; align-items: center; font-size: 1.125rem; font-weight: 800; color: #111827; }
    .info-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
    .info-group label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #9CA3AF; }
    .status-badge { padding: 4px 12px; border-radius: 999px; font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; }
    .badge-pending { background: #FEF3C7; color: #92400E; }
    .badge-preparing { background: #DBEAFE; color: #1E40AF; }
    .badge-delivered { background: #D1FAE5; color: #065F46; }
    .badge-cancelled { background: #FEE2E2; color: #991B1B; }

    .loading-state { text-align: center; padding: 64px 0; color: #6B7280; }
    .spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid #E5E7EB; border-top-color: #22C55E; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(id).subscribe({
        next: (order) => {
          this.order.set(order);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  getStatusClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
