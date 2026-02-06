import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';
import { Product, Category } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, FormsModule],
  template: `
    <div class="admin-container">
      <app-admin-navbar></app-admin-navbar>

      <main class="admin-main">
        <div class="page-header">
          <div>
            <h1>Menu Items</h1>
            <p class="subtitle">Manage your food and drink offerings</p>
          </div>
          <button class="btn btn-primary" (click)="showModal.set(true)">
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
                <th>Stock</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.id) {
                <tr>
                  <td class="img-cell">
                    <img [src]="product.imageUrl || 'assets/placeholder-food.png'" [alt]="product.name">
                  </td>
                  <td class="font-medium">{{ product.name }}</td>
                  <td>
                    <span class="badge badge-gray">{{ product.category || 'Uncategorized' }}</span>
                  </td>
                  <td>{{ product.price | currency }}</td>
                  <td>{{ product.stock }}</td>
                  <td>
                    <span class="status-dot" [class.active]="product.isActive"></span>
                    {{ product.isActive ? 'Active' : 'Archived' }}
                  </td>
                  <td class="text-right action-cell">
                    <button class="btn-icon danger" (click)="toggleStatus(product)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                        <line x1="12" y1="2" x2="12" y2="12"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                   <td colspan="7" style="text-align: center; padding: 48px; color: #6B7280;">
                     No items found. Click "Add Item" to create one.
                   </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="showModal.set(false)">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Add New Item</h2>
              <button class="close-btn" (click)="showModal.set(false)">&times;</button>
            </div>
            <form (submit)="onSubmit($event)" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Product Name</label>
                  <input type="text" name="name" [(ngModel)]="newProduct.name" required placeholder="e.g. Classic Burger">
                </div>
                <div class="form-group">
                  <label>Category</label>
                  <select name="category" [(ngModel)]="newProduct.category" required>
                    <option value="burgers">Burgers</option>
                    <option value="sides">Sides</option>
                    <option value="drinks">Drinks</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea name="description" [(ngModel)]="newProduct.description" placeholder="Short description..."></textarea>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="url" name="imageUrl" [(ngModel)]="newProduct.imageUrl" placeholder="https://example.com/image.jpg">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Price</label>
                  <input type="number" name="price" [(ngModel)]="newProduct.price" required step="0.01">
                </div>
                <div class="form-group">
                  <label>Initial Stock</label>
                  <input type="number" name="stock" [(ngModel)]="newProduct.stock" required>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="showModal.set(false)">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSubmitting()">
                  {{ isSubmitting() ? 'Saving...' : 'Create Product' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-container { min-height: 100vh; background: #F9FAFB; font-family: 'Inter', sans-serif; }
    .admin-main { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0; }
    .subtitle { color: #6B7280; margin: 4px 0 0; font-size: 14px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 8px; font-weight: 500; font-size: 14px; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: #22C55E; color: white; }
    .btn-primary:hover:not(:disabled) { background: #16A34A; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: #F3F4F6; color: #374151; }
    .btn-secondary:hover { background: #E5E7EB; }
    .card { background: white; border-radius: 12px; border: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 16px 24px; background: #F9FAFB; color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB; }
    td { padding: 16px 24px; vertical-align: middle; border-bottom: 1px solid #F3F4F6; color: #374151; font-size: 14px; }
    tr:last-child td { border-bottom: none; }
    tr:hover { background: #F9FAFB; }
    .font-medium { font-weight: 500; color: #111827; }
    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #D1D5DB; margin-right: 6px; }
    .status-dot.active { background: #22C55E; }
    .action-cell { display: flex; justify-content: flex-end; gap: 8px; }
    .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: transparent; border: 1px solid transparent; color: #6B7280; cursor: pointer; transition: all 0.2s; }
    .btn-icon:hover { background: #F3F4F6; color: #111827; }
    .btn-icon.danger:hover { background: #FEF2F2; color: #DC2626; }
    .text-right { text-align: right; }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card { background: white; width: 100%; max-width: 500px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #9CA3AF; }
    .modal-form { padding: 24px; }
    .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 14px; font-weight: 600; color: #374151; }
    .form-group input, .form-group textarea { padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus { border-color: #22C55E; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .modal-footer { margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px; }
  `]
})
export class ManageProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  showModal = signal(false);
  isSubmitting = signal(false);

  newProduct = {
    name: '',
    description: '',
    imageUrl: '',
    category: 'burgers' as Category,
    price: 0,
    stock: 0
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.showModal.set(false);
        this.isSubmitting.set(false);
        this.newProduct = { name: '', description: '', imageUrl: '', category: 'burgers' as Category, price: 0, stock: 0 };
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  toggleStatus(product: Product): void {
    this.productService.updateProduct(product.id, { isActive: !product.isActive }).subscribe(() => {
      this.loadProducts();
    });
  }
}
