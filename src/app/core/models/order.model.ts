import { Product } from './product.model';
import { User } from './user.model';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';

export interface Order {
    id: string;
    userId: string;
    user?: User;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product?: Product;
    quantity: number;
    price: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CreateOrderRequest {
    items: { productId: string; quantity: number }[];
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; class: string }> = {
    PENDING: { label: 'Pending', class: 'badge-pending' },
    PREPARING: { label: 'Preparing', class: 'badge-preparing' },
    DELIVERED: { label: 'Delivered', class: 'badge-delivered' },
    CANCELLED: { label: 'Cancelled', class: 'badge-cancelled' }
};
