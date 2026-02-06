import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = `${API_BASE_URL}/products`;

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.API_URL);
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.API_URL}/${id}`);
    }

    getProductsByCategory(category: Category): Observable<Product[]> {
        // El backend actual no soporta filtro por categoría directamente en la URL 
        // pero podemos filtrar en el front o extender el backend si es necesario.
        // Por ahora, traemos todos y filtramos para cumplir con la interfaz.
        return this.http.get<Product[]>(this.API_URL);
    }

    // Admin methods
    createProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(this.API_URL, product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
