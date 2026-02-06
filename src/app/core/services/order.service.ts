import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Order, OrderStatus, CreateOrderRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly API_URL = '/api/orders';

    // Mock orders for demo
    private mockOrders: Order[] = [
        {
            id: 'ORD-6403',
            userId: '1',
            status: 'DELIVERED',
            total: 45.50,
            createdAt: new Date('2024-01-24'),
            items: [
                { id: '1', orderId: 'ORD-6403', productId: '1', quantity: 2, price: 8.99 },
                { id: '2', orderId: 'ORD-6403', productId: '3', quantity: 3, price: 3.99 }
            ]
        },
        {
            id: 'ORD-6401',
            userId: '1',
            status: 'PREPARING',
            total: 12.00,
            createdAt: new Date('2024-01-23'),
            items: [
                { id: '3', orderId: 'ORD-6401', productId: '2', quantity: 1, price: 12.00 }
            ]
        },
        {
            id: 'ORD-4399',
            userId: '1',
            status: 'CANCELLED',
            total: 85.30,
            createdAt: new Date('2024-01-15'),
            items: [
                { id: '4', orderId: 'ORD-4399', productId: '1', quantity: 5, price: 8.99 },
                { id: '5', orderId: 'ORD-4399', productId: '5', quantity: 4, price: 6.00 }
            ]
        },
        {
            id: 'ORD-4382',
            userId: '1',
            status: 'DELIVERED',
            total: 14.50,
            createdAt: new Date('2024-01-10'),
            items: [
                { id: '6', orderId: 'ORD-4382', productId: '4', quantity: 2, price: 2.50 },
                { id: '7', orderId: 'ORD-4382', productId: '6', quantity: 2, price: 4.50 }
            ]
        }
    ];

    constructor(private http: HttpClient) { }

    // USER: Get my orders
    getMyOrders(): Observable<Order[]> {
        // DEMO MODE
        return of(this.mockOrders).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.get<Order[]>(this.API_URL);
    }

    // USER: Get order by ID
    getOrderById(id: string): Observable<Order | undefined> {
        // DEMO MODE
        const order = this.mockOrders.find(o => o.id === id);
        return of(order).pipe(delay(200));

        // PRODUCCIÓN:
        // return this.http.get<Order>(`${this.API_URL}/${id}`);
    }

    // USER: Create new order
    createOrder(items: { productId: string; quantity: number }[]): Observable<Order> {
        // DEMO MODE: Simular creación de pedido
        const newOrder: Order = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            userId: '1',
            status: 'PENDING',
            total: 0, // Would be calculated by backend
            createdAt: new Date(),
            items: items.map((item, index) => ({
                id: String(index + 1),
                orderId: '',
                productId: item.productId,
                quantity: item.quantity,
                price: 0
            }))
        };

        this.mockOrders.unshift(newOrder);
        return of(newOrder).pipe(delay(500));

        // PRODUCCIÓN:
        // return this.http.post<Order>(this.API_URL, { items });
    }

    // USER: Cancel order (only if PENDING)
    cancelOrder(id: string): Observable<Order> {
        // DEMO MODE
        const orderIndex = this.mockOrders.findIndex(o => o.id === id);
        if (orderIndex >= 0 && this.mockOrders[orderIndex].status === 'PENDING') {
            this.mockOrders[orderIndex].status = 'CANCELLED';
        }
        return of(this.mockOrders[orderIndex]).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.put<Order>(`${this.API_URL}/${id}/cancel`, {});
    }

    // ADMIN: Get all orders
    getAllOrders(): Observable<Order[]> {
        // DEMO MODE: Return all with user info
        const ordersWithUsers = this.mockOrders.map(order => ({
            ...order,
            user: { id: '1', name: 'Alex Student', email: 'alex@demo.com', role: 'USER' as const }
        }));
        return of(ordersWithUsers).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.get<Order[]>(`${this.API_URL}/admin/all`);
    }

    // ADMIN: Update order status
    updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
        // DEMO MODE
        const orderIndex = this.mockOrders.findIndex(o => o.id === id);
        if (orderIndex >= 0) {
            this.mockOrders[orderIndex].status = status;
        }
        return of(this.mockOrders[orderIndex]).pipe(delay(300));

        // PRODUCCIÓN:
        // return this.http.put<Order>(`${this.API_URL}/${id}/status`, { status });
    }

    // ADMIN: Get order stats
    getOrderStats(): Observable<{ totalOrders: number; pendingOrders: number; todayRevenue: number }> {
        // DEMO MODE
        const stats = {
            totalOrders: 1245,
            pendingOrders: 15,
            todayRevenue: 3450
        };
        return of(stats).pipe(delay(200));

        // PRODUCCIÓN:
        // return this.http.get<any>(`${this.API_URL}/admin/stats`);
    }
}
