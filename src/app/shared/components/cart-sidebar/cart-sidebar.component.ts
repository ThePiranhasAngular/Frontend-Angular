import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-sidebar">
      <div class="cart-header">
        <div class="header-title-group">
          <h3>Your Order</h3>
          @if (cartService.itemCount() > 0) {
            <span class="count-badge">{{ cartService.itemCount() }}</span>
          }
        </div>
        @if (cartService.itemCount() > 0) {
          <button class="clear-btn" (click)="clearCart()">Clear all</button>
        }
      </div>

      <div class="cart-items">
        @if (cartService.itemCount() === 0) {
          <div class="empty-cart">
            <div class="empty-icon-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <p>Your cart is empty</p>
            <span>Start adding items to your order</span>
          </div>
        } @else {
          @for (item of cartService.cartItems(); track item.product.id) {
            <div class="cart-item">
              <img [src]="item.product.imageUrl" [alt]="item.product.name" class="item-image">
              <div class="item-details">
                <div class="item-header">
                  <h4>{{ item.product.name }}</h4>
                  <span class="item-price">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                </div>
                <p class="item-meta">No onions</p>
                <div class="item-controls">
                  <div class="quantity-controls">
                    <button class="qty-btn" (click)="decrement(item.product.id)">−</button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button class="qty-btn" (click)="increment(item.product.id)">+</button>
                  </div>
                  <button class="remove-btn" (click)="removeItem(item.product.id)">Remove</button>
                </div>
              </div>
            </div>
          }
        }
      </div>

      @if (cartService.itemCount() > 0) {
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span class="val">\${{ cartService.subtotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (8%)</span>
            <span class="val">\${{ cartService.tax().toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="val total-val">\${{ cartService.total().toFixed(2) }}</span>
          </div>
        </div>

        <div class="cart-actions">
           <button 
            class="btn-confirm"
            [disabled]="isCreatingOrder"
            (click)="confirmOrder()"
          >
            @if (isCreatingOrder) {
              <span class="spinner-small"></span>
            }
            Confirm Order
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-sidebar {
      background: var(--white);
      border-radius: 12px;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #E5E7EB;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #F3F4F6;
    }

    .header-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cart-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 800;
      color: #111827;
    }

    .count-badge {
      background: #22C55E;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-btn {
      background: none;
      border: none;
      color: #6B7280;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
    }
    .clear-btn:hover { color: #DC2626; }

    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 16px 24px;
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #9CA3AF;
      text-align: center;
    }

    .empty-icon-bg {
        width: 64px; height: 64px;
        background: #F3F4F6;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 16px;
        color: #9CA3AF;
    }

    .empty-cart p { margin: 0 0 4px; font-weight: 600; color: #374151; }
    .empty-cart span { font-size: 0.875rem; }

    .cart-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px dashed #E5E7EB;
    }
    .cart-item:last-child { border-bottom: none; margin-bottom: 0; }

    .item-image {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      object-fit: cover;
      background: #F3F4F6;
    }

    .item-details { flex: 1; }

    .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
    .item-header h4 { margin: 0; font-size: 0.9375rem; font-weight: 700; color: #111827; }
    .item-price { font-weight: 700; color: #111827; font-size: 0.9375rem; }
    
    .item-meta { margin: 0 0 10px; font-size: 0.75rem; color: #6B7280; }

    .item-controls { display: flex; justify-content: space-between; align-items: center; }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #F9FAFB;
      padding: 2px;
      border-radius: 6px;
    }

    .qty-btn {
      width: 24px; height: 24px;
      border-radius: 4px;
      border: 1px solid transparent;
      background: white;
      color: #374151;
      font-size: 14px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      font-weight: 500;
    }
    .qty-btn:hover { background: #F3F4F6; }

    .qty-value { font-size: 0.875rem; font-weight: 600; width: 16px; text-align: center; }

    .remove-btn {
      background: none;
      border: none;
      color: #EF4444; /* Red text */
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }
    .remove-btn:hover { text-decoration: underline; }

    .cart-summary {
      padding: 24px;
      background: #F9FAFB;
      border-top: 1px solid #E5E7EB;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #6B7280;
      margin-bottom: 10px;
    }

    .summary-row.total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #D1D5DB;
      color: #111827;
    }
    
    .summary-row.total span { font-weight: 700; font-size: 1.125rem; }
    .total-val { color: #22C55E; }

    .cart-actions { padding: 0 24px 24px; background: #F9FAFB; border-radius: 0 0 12px 12px; }

    .btn-confirm {
      width: 100%;
      padding: 14px;
      background: #22C55E;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background 0.2s;
    }
    .btn-confirm:hover { background: #16A34A; }
    .btn-confirm:disabled { background: #9CA3AF; cursor: not-allowed; }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  @Output() orderCreated = new EventEmitter<void>();

  isCreatingOrder = false;

  increment(productId: string): void {
    this.cartService.incrementQuantity(productId);
  }

  decrement(productId: string): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  confirmOrder(): void {
    this.isCreatingOrder = true;
    const items = this.cartService.getCartItemsForOrder();

    this.orderService.createOrder(items).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.isCreatingOrder = false;
        this.orderCreated.emit();
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.isCreatingOrder = false;
      }
    });
  }
}
