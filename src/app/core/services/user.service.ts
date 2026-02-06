import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface UserManagement {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private readonly API_URL = `${API_BASE_URL}/users`;

    getUsers(): Observable<UserManagement[]> {
        return this.http.get<UserManagement[]>(this.API_URL);
    }

    updateRole(userId: string, role: string): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${userId}/role`, JSON.stringify(role), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
