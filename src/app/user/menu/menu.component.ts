import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CartSidebarComponent } from '../../shared/components/cart-sidebar/cart-sidebar.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, Category, CATEGORIES } from '../../core/models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ProductCardComponent, CartSidebarComponent],
  template: `
    <div class="page-container">
      <app-navbar />
      
      <main class="main-content">
        <div class="menu-container">
          <!-- Menu Section -->
          <section class="menu-section">
            <div class="menu-header">
              <h1>Our Menu</h1>
              
              <!-- Search -->
              <div class="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search food..."
                  (input)="onSearch($event)"
                >
              </div>
            </div>

            <!-- Categories -->
            <div class="categories">
              <button 
                class="category-btn"
                [class.active]="activeCategory() === null"
                (click)="setCategory(null)"
              >
                <span class="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </span>
                All
              </button>
              
              <button 
                class="category-btn"
                [class.active]="activeCategory() === 'burgers'"
                (click)="setCategory('burgers')"
              >
                <span class="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h8"></path>
                    <path d="M12 8v8"></path>
                  </svg>
                </span>
                Burgers
              </button>

              <button 
                class="category-btn"
                [class.active]="activeCategory() === 'sides'"
                (click)="setCategory('sides')"
              >
                <span class="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </span>
                Sides
              </button>

              <button 
                class="category-btn"
                [class.active]="activeCategory() === 'drinks'"
                (click)="setCategory('drinks')"
              >
                <span class="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </span>
                Drinks
              </button>

              <button 
                class="category-btn"
                [class.active]="activeCategory() === 'desserts'"
                (click)="setCategory('desserts')"
              >
                <span class="cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z"></path>
                    <path d="M18.36 6.64a9 9 0 0 1 2.05 4.93"></path>
                  </svg>
                </span>
                Desserts
              </button>
            </div>

            <!-- Products Grid -->
            <div class="products-grid">
              @if (isLoading()) {
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="product-skeleton">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                      <div class="skeleton-line"></div>
                      <div class="skeleton-line short"></div>
                    </div>
                  </div>
                }
              } @else {
                @for (product of filteredProducts(); track product.id) {
                  <app-product-card 
                    [product]="product"
                    (addToCart)="onAddToCart($event)"
                  />
                }
              }
            </div>
          </section>

          <!-- Cart Sidebar -->
          <aside class="cart-section">
            <app-cart-sidebar />
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
    }

    .menu-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 32px;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .menu-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--white);
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      width: 320px;
      transition: all 0.2s;
    }

    .search-box:focus-within {
      border-color: #22C55E;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    .search-box svg {
      color: #9CA3AF;
    }

    .search-box input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.9375rem;
      color: #111827;
    }
    .search-box input::placeholder { color: #9CA3AF; }

    .categories {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .category-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: var(--white);
      border: 1px solid #E5E7EB;
      border-radius: 999px; /* Pill shape */
      font-size: 0.9375rem;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .cat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4B5563;
    }

    .category-btn:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .category-btn.active {
      background: #111827; /* Black selected */
      border-color: #111827;
      color: var(--white);
    }

    .category-btn.active .cat-icon {
      color: var(--white);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    .cart-section {
      position: sticky;
      top: 24px;
      height: fit-content;
    }

    /* Skeleton Loading */
    .product-skeleton {
      background: var(--white);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #E5E7EB;
    }

    .skeleton-image {
      height: 180px;
      background: #F3F4F6;
      animation: pulse 2s infinite;
    }

    .skeleton-content {
      padding: 16px;
    }

    .skeleton-line {
      height: 20px;
      background: #F3F4F6;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .skeleton-line.short {
      width: 60%;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .menu-container {
        grid-template-columns: 1fr;
      }

      .cart-section {
        display: none; /* In real app, might separate this or show as bottom sheet */
      }
    }
  `]
})
export class MenuComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  activeCategory = signal<Category | null>(null);
  searchTerm = signal('');
  isLoading = signal(true);

  categories = CATEGORIES;

  filteredProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.updateFilteredProducts();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  setCategory(category: Category | null): void {
    this.activeCategory.set(category);
    this.updateFilteredProducts();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.updateFilteredProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  private updateFilteredProducts(): void {
    let filtered = this.products();

    // Filter by category
    const category = this.activeCategory();
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by search
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    this.filteredProducts.set(filtered);
  }
}
