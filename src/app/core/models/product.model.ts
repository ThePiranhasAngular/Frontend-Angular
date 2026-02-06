export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    category: Category;
    imageUrl: string;
    createdAt?: Date;
}

export type Category = 'burgers' | 'sides' | 'drinks' | 'desserts';

export const CATEGORIES: { key: Category; label: string; icon: string }[] = [
    { key: 'burgers', label: 'Burgers', icon: '🍔' },
    { key: 'sides', label: 'Sides', icon: '🍟' },
    { key: 'drinks', label: 'Drinks', icon: '🥤' },
    { key: 'desserts', label: 'Desserts', icon: '🍰' }
];
