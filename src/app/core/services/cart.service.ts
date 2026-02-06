import { Injectable, signal, computed, effect } from '@angular/core';
import { Product, CartItem } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly STORAGE_KEY = 'restor_app_cart';

    private cartItemsSignal = signal<CartItem[]>([]);

    readonly cartItems = this.cartItemsSignal.asReadonly();
    readonly itemCount = computed(() =>
        this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
    );
    readonly subtotal = computed(() =>
        this.cartItemsSignal().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    );
    readonly tax = computed(() => this.subtotal() * 0.08); // 8% tax
    readonly total = computed(() => this.subtotal() + this.tax());

    constructor() {
        this.loadFromStorage();

        // Auto-save to localStorage when cart changes
        effect(() => {
            const items = this.cartItemsSignal();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        });
    }

    addToCart(product: Product, quantity: number = 1): void {
        const currentItems = this.cartItemsSignal();
        const existingIndex = currentItems.findIndex(item => item.product.id === product.id);

        if (existingIndex >= 0) {
            // Update existing item
            const updated = [...currentItems];
            updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: updated[existingIndex].quantity + quantity
            };
            this.cartItemsSignal.set(updated);
        } else {
            // Add new item
            this.cartItemsSignal.set([...currentItems, { product, quantity }]);
        }
    }

    removeFromCart(productId: string): void {
        const currentItems = this.cartItemsSignal();
        this.cartItemsSignal.set(currentItems.filter(item => item.product.id !== productId));
    }

    updateQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const currentItems = this.cartItemsSignal();
        const updated = currentItems.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        );
        this.cartItemsSignal.set(updated);
    }

    incrementQuantity(productId: string): void {
        const item = this.cartItemsSignal().find(i => i.product.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    decrementQuantity(productId: string): void {
        const item = this.cartItemsSignal().find(i => i.product.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    clearCart(): void {
        this.cartItemsSignal.set([]);
        localStorage.removeItem(this.STORAGE_KEY);
    }

    getCartItemsForOrder(): { productId: string; quantity: number }[] {
        return this.cartItemsSignal().map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }));
    }

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const items = JSON.parse(stored) as CartItem[];
                this.cartItemsSignal.set(items);
            }
        } catch (e) {
            console.error('Error loading cart from storage:', e);
            this.cartItemsSignal.set([]);
        }
    }
}
