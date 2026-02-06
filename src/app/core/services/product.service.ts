import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Product, Category } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = '/api/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        // DEMO MODE: Retornar productos mock
        return of(this.getMockProducts()).pipe(delay(300));

        // PRODUCCIÓN: Descomentar para usar con backend real
        // return this.http.get<Product[]>(this.API_URL);
    }

    getProductById(id: string): Observable<Product | undefined> {
        // DEMO MODE
        const product = this.getMockProducts().find(p => p.id === id);
        return of(product).pipe(delay(200));

        // PRODUCCIÓN:
        // return this.http.get<Product>(`${this.API_URL}/${id}`);
    }

    getProductsByCategory(category: Category): Observable<Product[]> {
        // DEMO MODE
        const products = this.getMockProducts().filter(p => p.category === category);
        return of(products).pipe(delay(200));

        // PRODUCCIÓN:
        // return this.http.get<Product[]>(`${this.API_URL}?category=${category}`);
    }

    // Admin methods
    createProduct(product: Partial<Product>): Observable<Product> {
        // DEMO MODE
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            stock: product.stock || 0,
            isActive: true,
            category: product.category || 'burgers',
            imageUrl: product.imageUrl || 'https://via.placeholder.com/200',
            createdAt: new Date()
        };
        return of(newProduct).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.post<Product>(this.API_URL, product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<Product> {
        const existing = this.getMockProducts().find(p => p.id === id);
        const updated = { ...existing, ...product } as Product;
        return of(updated).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.put<Product>(`${this.API_URL}/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
        return of(void 0).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    // ===== MOCK DATA =====
    private getMockProducts(): Product[] {
        return [
            {
                id: '1',
                name: 'Classic Beef Burger',
                description: 'Juicy beef patty with cheddar, lettuce, tomato on sesame bun',
                price: 8.99,
                stock: 50,
                isActive: true,
                category: 'burgers',
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
            },
            {
                id: '2',
                name: 'Double Bacon Melt',
                description: 'Two patties, crispy bacon, melted cheese, special sauce',
                price: 12.99,
                stock: 30,
                isActive: true,
                category: 'burgers',
                imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=200&fit=crop'
            },
            {
                id: '3',
                name: 'Golden Fries',
                description: 'Crispy golden french fries with sea salt',
                price: 3.99,
                stock: 100,
                isActive: true,
                category: 'sides',
                imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop'
            },
            {
                id: '4',
                name: 'Cola Zero',
                description: 'Chilled zero sugar cola with ice and a slice of lemon',
                price: 2.50,
                stock: 200,
                isActive: true,
                category: 'drinks',
                imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop'
            },
            {
                id: '5',
                name: 'Donut Box',
                description: 'Assorted glazed and frosted donuts',
                price: 6.00,
                stock: 25,
                isActive: true,
                category: 'desserts',
                imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop'
            },
            {
                id: '6',
                name: 'Pepperoni Slice',
                description: 'Large NY style slice with double pepperoni',
                price: 4.50,
                stock: 40,
                isActive: true,
                category: 'sides',
                imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop'
            }
        ];
    }
}
