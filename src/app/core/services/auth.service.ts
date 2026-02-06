import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { API_BASE_URL } from '../config/api.config';

interface JwtPayload {
    sub: string;
    email: string;
    role: 'USER' | 'ADMIN';
    name?: string;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${API_BASE_URL}/auth`;
    private readonly TOKEN_KEY = 'restor_app_token';

    private currentUserSignal = signal<User | null>(null);

    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isAuthenticated = computed(() => !!this.currentUserSignal());
    readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromToken();
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap((response: AuthResponse) => this.handleAuthResponse(response))
        );
    }

    register(data: RegisterRequest): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.API_URL}/register`, data);
    }

    logout(): void {
        sessionStorage.removeItem(this.TOKEN_KEY);
        this.currentUserSignal.set(null);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    hasRole(role: 'USER' | 'ADMIN'): boolean {
        return this.userRole() === role;
    }

    private handleAuthResponse(response: AuthResponse): void {
        sessionStorage.setItem(this.TOKEN_KEY, response.token);
        this.loadUserFromToken();
    }

    private loadUserFromToken(): void {
        const token = this.getToken();
        if (!token || !this.isTokenValid()) {
            this.currentUserSignal.set(null);
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            this.currentUserSignal.set({
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name || decoded.email,
                role: decoded.role
            });
        } catch {
            this.currentUserSignal.set(null);
        }
    }
}
