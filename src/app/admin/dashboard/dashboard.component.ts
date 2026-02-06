import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderStatus, ORDER_STATUS_CONFIG } from '../../core/models';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, AdminNavbarComponent],
  template: `
    <div class="admin-container">
      <app-admin-navbar></app-admin-navbar>

      <!-- Main Content -->
      <main class="admin-main">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrapper green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Orders</span>
              <span class="stat-value">{{ stats().totalOrders | number }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Pending Orders</span>
              <span class="stat-value">{{ stats().pendingOrders }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper green-dollar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Today's Revenue</span>
              <span class="stat-value">\${{ stats().todayRevenue | number:'1.0-0' }}</span>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Orders Table Section -->
          <section class="orders-section">
            <div class="section-header">
              <h2>Recent Orders</h2>
              <div class="section-actions">
                <button class="btn btn-outline btn-sm icon-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  Filter
                </button>
                <button class="btn btn-outline btn-sm icon-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export
                </button>
              </div>
            </div>

            <div class="orders-table-wrapper">
              <table class="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of orders(); track order.id) {
                    <tr 
                      [class.selected]="selectedOrder()?.id === order.id"
                      (click)="selectOrder(order)"
                    >
                      <td class="order-id">#{{ order.id.replace('ORD-', '') }}</td>
                      <td class="user-cell">{{ order.user?.name }}</td>
                      <td class="date-cell">{{ order.createdAt | date:'MMM d, HH:mm' }}</td>
                      <td><app-status-badge [status]="order.status" /></td>
                      <td class="total-cell">\${{ order.total.toFixed(2) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="pagination">
              <button class="page-nav-btn disable">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <span class="page-dots">...</span>
              <button class="page-btn">12</button>
              <button class="page-nav-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </section>

          <!-- Order Detail Panel -->
          @if (selectedOrder()) {
            <aside class="order-detail-panel">
              <div class="detail-header">
                <div class="detail-title">
                  <span class="label-small">ORDER DETAILS</span>
                  <h3>#{{ selectedOrder()!.id.replace('ORD-', '') }}</h3>
                </div>
                <app-status-badge [status]="selectedOrder()!.status" />
              </div>

              <div class="customer-card">
                <div class="customer-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="customer-info">
                  <span class="label-small">Customer</span>
                  <h4>{{ selectedOrder()!.user?.name }}</h4>
                  <p>{{ selectedOrder()!.user?.email }}</p>
                  <p class="phone">+1 (555) 123-4567</p>
                </div>
              </div>

              <div class="item-list">
                <span class="label-small section-label">Items</span>
                @for (item of selectedOrder()!.items; track item.id) {
                  <div class="order-item">
                    <div class="item-qty">{{ item.quantity }}x</div>
                    <div class="item-main">
                      <span class="item-name">Product #{{ item.productId }}</span>
                      <span class="item-meta">Regular size, No onions</span>
                    </div>
                    <div class="item-price">\${{ (item.price * item.quantity).toFixed(2) }}</div>
                  </div>
                }
              </div>

              <div class="totals-section">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>\${{ (selectedOrder()!.total * 0.92).toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Tax (8%)</span>
                  <span>\${{ (selectedOrder()!.total * 0.08).toFixed(2) }}</span>
                </div>
                <div class="summary-row grand-total">
                  <span>Total</span>
                  <span>\${{ selectedOrder()!.total.toFixed(2) }}</span>
                </div>
              </div>

              <div class="action-footer">
                <span class="label-small">UPDATE STATUS</span>
                <div class="status-action-row">
                  <select 
                    class="status-select" 
                    [value]="selectedOrder()!.status"
                    (change)="onStatusChange($event)"
                  >
                     @for (status of statusOptions; track status) {
                      <option [value]="status">{{ statusConfig[status].label }}</option>
                    }
                  </select>
                  <button 
                    class="btn btn-primary update-btn"
                    (click)="updateStatus()"
                    [disabled]="isUpdating()"
                  >
                    @if(isUpdating()) { <span class="spinner-mini"></span> }
                    Update
                  </button>
                </div>
              </div>
            </aside>
          } @else {
            <div class="empty-state-panel">
              <p>Select order to view details</p>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #F9FAFB;
      font-family: 'Inter', sans-serif;
    }

    /* Header styles moved to AdminNavbarComponent */

    /* Main */
    .admin-main {
      padding: 32px;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--white);
      border-radius: 8px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #E5E7EB;
    }

    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-wrapper.green { background: #DCFCE7; color: #16A34A; }
    .stat-icon-wrapper.orange { background: #FEF3C7; color: #D97706; }
    .stat-icon-wrapper.green-dollar { background: #DCFCE7; color: #16A34A; }

    .stat-content { display: flex; flex-direction: column; }
    .stat-label { font-size: 14px; color: #6B7280; margin-bottom: 4px; }
    .stat-value { font-size: 24px; font-weight: 700; color: #111827; }

    /* Content Layout */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      align-items: start;
    }

    /* Orders Section */
    .orders-section {
      background: var(--white);
      border-radius: 8px; /* Slightly squarer than before */
      padding: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #E5E7EB;
      overflow: hidden;
    }

    .section-header {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-header h2 { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
    
    .section-actions { display: flex; gap: 12px; }
    
    .btn-outline {
      border: 1px solid #E5E7EB;
      background: white;
      color: #374151;
      border-radius: 6px;
      padding: 8px 12px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-outline:hover { background: #F9FAFB; }
    .icon-btn { display: flex; align-items: center; gap: 8px; }

    .orders-table { width: 100%; border-collapse: collapse; }
    
    .orders-table th {
      text-align: left;
      padding: 12px 24px;
      background: #F9FAFB;
      color: #6B7280;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #E5E7EB;
    }

    .orders-table td {
      padding: 16px 24px;
      color: #374151;
      font-size: 14px;
      border-bottom: 1px solid #F3F4F6;
    }

    .orders-table tr { cursor: pointer; transition: background 0.15s; }
    .orders-table tr:hover { background: #F9FAFB; }
    
    /* Selection Style */
    .orders-table tr.selected {
      background: #ecfdf5; /* Very light green */
      position: relative;
    }
    .orders-table tr.selected td:first-child {
      position: relative;
    }
    .orders-table tr.selected td:first-child::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #22C55E;
    }

    .order-id { color: #9CA3AF; font-family: monospace; }
    .orders-table tr.selected .order-id { color: #16A34A; font-weight: 600; }
    
    .user-cell { font-weight: 500; color: #111827; }
    .text-right { text-align: right; }
    .total-cell { text-align: right; font-weight: 600; color: #111827; }

    /* Pagination */
    .pagination {
      padding: 16px 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
    }
    .page-btn, .page-nav-btn {
      min-width: 32px;
      height: 32px;
      padding: 0 6px;
      display: flex; 
      align-items: center; 
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 4px;
      color: #6B7280;
      cursor: pointer;
      font-size: 13px;
    }
    .page-btn:hover, .page-nav-btn:hover:not(.disable) { background: #F3F4F6; }
    .page-btn.active { 
      background: #22C55E; 
      color: white; 
      border-radius: 50%; /* Circle style active */
    }
    .page-dots { color: #9CA3AF; padding: 0 8px; }
    .page-nav-btn.disable { color: #D1D5DB; cursor: default; }

    /* Detail Panel */
    .order-detail-panel {
      background: var(--white);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #E5E7EB;
      padding: 24px;
    }

    .label-small {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #9CA3AF;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    
    .detail-title h3 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }

    .customer-card {
      display: flex;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid #E5E7EB;
      margin-bottom: 24px;
    }

    .customer-avatar {
      width: 48px;
      height: 48px;
      background: #F3F4F6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6B7280;
    }

    .customer-info h4 { margin: 0; font-size: 15px; font-weight: 600; color: #111827; }
    .customer-info p { margin: 2px 0 0; color: #6B7280; font-size: 13px; }
    .customer-info .phone { margin-top: 4px; }

    .item-list { margin-bottom: 24px; }
    .section-label { margin-bottom: 12px; }

    .order-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 0;
    }

    .item-qty {
      background: #F3F4F6;
      color: #374151;
      font-weight: 600;
      font-size: 13px;
      padding: 4px 8px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .item-main { flex: 1; display: flex; flex-direction: column; }
    .item-name { font-weight: 600; color: #111827; font-size: 14px; }
    .item-meta { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
    .item-price { font-weight: 600; color: #111827; font-size: 14px; }

    .totals-section {
      padding: 16px 0;
      border-top: 1px solid #E5E7EB;
      border-bottom: 1px solid #E5E7EB;
      margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      color: #6B7280;
    }

    .summary-row.grand-total {
      margin-top: 16px;
      color: #111827;
      font-weight: 700;
      font-size: 18px;
      align-items: center;
    }

    .status-action-row {
      display: flex;
      gap: 12px;
    }

    .status-select {
      flex: 1;
      padding: 10px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      color: #374151;
    }

    .update-btn {
      padding: 0 20px;
      background: #22C55E;
      border: none;
      color: white;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .update-btn:hover { background: #16A34A; }

    .empty-state-panel {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 8px;
      border: 1px dashed #D1D5DB;
      color: #9CA3AF;
    }
    
    .spinner-mini {
      display: inline-block;
      width: 12px; height: 12px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
    }

    @media (max-width: 1280px) {
      .content-grid { grid-template-columns: 1fr; }
      .order-detail-panel { margin-top: 24px; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  orders = signal<Order[]>([]);
  stats = signal({ totalOrders: 0, pendingOrders: 0, todayRevenue: 0 });
  selectedOrder = signal<Order | null>(null);
  isUpdating = signal(false);
  newStatus = signal<OrderStatus>('PENDING');

  statusOptions: OrderStatus[] = ['PENDING', 'PREPARING', 'DELIVERED', 'CANCELLED'];
  statusConfig = ORDER_STATUS_CONFIG;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        if (orders.length > 0 && !this.selectedOrder()) {
          this.selectOrder(orders[0]); // Select first by default
        }
      }
    });

    this.orderService.getOrderStats().subscribe({
      next: (stats) => this.stats.set(stats)
    });
  }

  selectOrder(order: Order): void {
    this.selectedOrder.set(order);
    this.newStatus.set(order.status);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.newStatus.set(select.value as OrderStatus);
  }

  updateStatus(): void {
    const order = this.selectedOrder();
    if (!order) return;

    this.isUpdating.set(true);
    this.orderService.updateOrderStatus(order.id, this.newStatus()).subscribe({
      next: (updatedOrder) => {
        this.loadData();
        this.selectedOrder.set(updatedOrder);
        this.isUpdating.set(false);
      },
      error: () => {
        this.isUpdating.set(false);
      }
    });
  }
}
