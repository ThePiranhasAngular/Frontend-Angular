import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <!-- Image -->
      <div class="product-image">
        <span class="category-badge">{{ product.category }}</span>
        <img [src]="product.imageUrl" [alt]="product.name" loading="lazy">
      </div>
      
      <!-- Content -->
      <div class="product-content">
        <div class="product-header">
          <h3 class="product-name">{{ product.name }}</h3>
          <span class="product-price">\${{ product.price.toFixed(2) }}</span>
        </div>
        <p class="product-description">{{ product.description }}</p>
      </div>

      <!-- Footer -->
      <div class="product-footer">
        <button class="btn-add" (click)="onAddToCart()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
          </svg>
          Add to order
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: var(--white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Softer shadow */
      transition: box-shadow 0.2s, transform 0.2s;
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid var(--gray-100);
    }

    .product-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    .product-image {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .category-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: white; /* White badge as per some modern designs, or keep dark. Image shows white/light badge with text? let's look closer at image... actually image shows "BURGERS" in white text on black/dark bg? No, wait. One card has "BURGERS" in white box? Let's stick to a clean look. Let's make it white with dark text for high contrast on image, or keep dark. Let's stick to the previous dark badge but refined. Actually image shows white badge with black text. */
      background: rgba(255, 255, 255, 0.9);
      color: #111827;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 8px;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .product-content {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      gap: 8px;
    }

    .product-name {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
      color: #111827;
      line-height: 1.25;
    }

    .product-price {
      font-size: 1rem;
      font-weight: 700;
      color: #22C55E; /* Bright green */
      white-space: nowrap;
    }

    .product-description {
      font-size: 0.8125rem;
      color: #6B7280;
      margin: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: auto; /* Push footer down */
    }

    .product-footer {
      padding: 0 16px 16px;
    }

    .btn-add {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      background: #F3F4F6; /* Light gray */
      color: #111827;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-add:hover {
      background: #E5E7EB; /* Slightly darker gray on hover */
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
