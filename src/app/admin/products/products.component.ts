import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

@Component({
    selector: 'app-admin-products',
    standalone: true,
    imports: [CommonModule, AdminNavbarComponent],
    template: `
    <div class="admin-container">
      <app-admin-navbar></app-admin-navbar>

      <main class="admin-main">
        <div class="page-header">
          <div>
            <h1>Menu Items</h1>
            <p class="subtitle">Manage your food and drink offerings</p>
          </div>
          <button class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Item
          </button>
        </div>

        <div class="card table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.id) {
                <tr>
                  <td class="img-cell">
                    <img [src]="product.imageUrl" [alt]="product.name">
                  </td>
                  <td class="font-medium">{{ product.name }}</td>
                  <td>
                    <span class="badge badge-gray">{{ product.category }}</span>
                  </td>
                  <td>{{ product.price | currency }}</td>
                  <td>
                    <span class="status-dot" [class.active]="product.isActive"></span>
                    {{ product.isActive ? 'Active' : 'Archived' }}
                  </td>
                  <td class="text-right action-cell">
                    <button class="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="btn-icon danger">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
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

    .admin-main {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .subtitle {
      color: #6B7280;
      margin: 4px 0 0;
      font-size: 14px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #22C55E;
      color: white;
    }
    .btn-primary:hover { background: #16A34A; }

    .card {
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 16px 24px;
      background: #F9FAFB;
      color: #6B7280;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #E5E7EB;
    }

    td {
      padding: 16px 24px;
      vertical-align: middle;
      border-bottom: 1px solid #F3F4F6;
      color: #374151;
      font-size: 14px;
    }

    tr:last-child td { border-bottom: none; }
    tr:hover { background: #F9FAFB; }

    .img-cell img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
      background: #F3F4F6;
    }

    .font-medium { font-weight: 500; color: #111827; }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }
    
    .badge-gray {
      background: #F3F4F6;
      color: #4B5563;
    }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #D1D5DB;
      margin-right: 6px;
    }
    .status-dot.active { background: #22C55E; }

    .action-cell {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: transparent;
      border: 1px solid transparent;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #F3F4F6;
      color: #111827;
    }
    
    .btn-icon.danger:hover {
      background: #FEF2F2;
      color: #DC2626;
    }

    .text-right { text-align: right; }
  `]
})
export class ManageProductsComponent {
    private productService = inject(ProductService);
    products = signal<Product[]>([]);

    constructor() {
        this.productService.getProducts().subscribe(products => {
            this.products.set(products);
        });
    }
}
