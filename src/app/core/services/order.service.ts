import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly API_URL = `${API_BASE_URL}/orders`;

    constructor(private http: HttpClient) { }

    // USER: Get my orders / ADMIN: Get all orders (Same endpoint, backend filters by role)
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.API_URL);
    }

    // USER/ADMIN: Get order by ID
    getOrderById(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.API_URL}/${id}`);
    }

    // USER: Create new order
    createOrder(items: { productId: string; quantity: number }[]): Observable<Order> {
        return this.http.post<Order>(this.API_URL, { items });
    }

    // USER: Cancel order (only if PENDING)
    cancelOrder(id: string): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}/cancel`, {});
    }

    // ADMIN: Update order status
    updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // ADMIN: Get order stats 
    // (Note: This might need a custom endpoint in backend if you want real data)
    getOrderStats(): Observable<{ totalOrders: number; pendingOrders: number; todayRevenue: number }> {
        return this.http.get<any>(`${this.API_URL}/stats`);
    }
}
