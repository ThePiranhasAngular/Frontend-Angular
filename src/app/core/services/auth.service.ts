import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, delay } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';

interface JwtPayload {
    sub: string;
    email: string;
    role: 'USER' | 'ADMIN';
    name: string;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = '/api/auth';
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
        // DEMO MODE: Simular login sin backend
        return this.mockLogin(credentials);

        // PRODUCCIÓN: Descomentar para usar con backend real
        // return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
        //   tap(response => this.handleAuthResponse(response))
        // );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        // DEMO MODE: Simular registro
        return this.mockRegister(data);

        // PRODUCCIÓN: Descomentar para usar con backend real
        // return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
        //   tap(response => this.handleAuthResponse(response))
        // );
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
        this.currentUserSignal.set(response.user);
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
                name: decoded.name,
                role: decoded.role
            });
        } catch {
            this.currentUserSignal.set(null);
        }
    }

    // ===== MOCK METHODS (for demo without backend) =====

    private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
        // Obtener usuarios guardados en localStorage
        const storedUsersJson = localStorage.getItem('restor_app_users');
        const storedUsers: Record<string, { password: string; user: User }> = storedUsersJson
            ? JSON.parse(storedUsersJson)
            : {
                // Usuarios demo predefinidos
                'user@demo.com': {
                    password: '123456',
                    user: { id: '1', name: 'Usuario Demo', email: 'user@demo.com', role: 'USER' }
                },
                'admin@demo.com': {
                    password: '123456',
                    user: { id: '2', name: 'Admin Demo', email: 'admin@demo.com', role: 'ADMIN' }
                }
            };

        // Guardar usuarios demo si no existían
        if (!storedUsersJson) {
            localStorage.setItem('restor_app_users', JSON.stringify(storedUsers));
        }

        const existingUser = storedUsers[credentials.email];

        if (existingUser) {
            if (existingUser.password === credentials.password) {
                const token = this.generateMockToken(existingUser.user);
                const response: AuthResponse = { token, user: existingUser.user };
                return of(response).pipe(
                    delay(500),
                    tap(res => this.handleAuthResponse(res))
                );
            } else {
                return new Observable(subscriber => {
                    setTimeout(() => {
                        subscriber.error(new Error('Contraseña incorrecta'));
                    }, 500);
                });
            }
        }

        // Usuario no encontrado
        return new Observable(subscriber => {
            setTimeout(() => {
                subscriber.error(new Error('Usuario no encontrado. ¿Ya te registraste?'));
            }, 500);
        });
    }

    private mockRegister(data: RegisterRequest): Observable<AuthResponse> {
        // Verificar si ya existe el usuario
        const storedUsersJson = localStorage.getItem('restor_app_users');
        const storedUsers: Record<string, { password: string; user: User }> = storedUsersJson
            ? JSON.parse(storedUsersJson)
            : {};

        if (storedUsers[data.email]) {
            return new Observable(subscriber => {
                setTimeout(() => {
                    subscriber.error(new Error('Este correo ya está registrado'));
                }, 500);
            });
        }

        // Crear nuevo usuario
        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            email: data.email,
            role: data.role || 'USER'
        };

        // Guardar en localStorage
        storedUsers[data.email] = { password: data.password, user };
        localStorage.setItem('restor_app_users', JSON.stringify(storedUsers));

        const token = this.generateMockToken(user);
        const response: AuthResponse = { token, user };

        return of(response).pipe(
            delay(500),
            tap(res => this.handleAuthResponse(res))
        );
    }

    private generateMockToken(user: User): string {
        // Crear un token JWT mock (solo para demo, no seguro para producción)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 86400 // 24 horas
        }));
        const signature = btoa('mock-signature');

        return `${header}.${payload}.${signature}`;
    }
}
