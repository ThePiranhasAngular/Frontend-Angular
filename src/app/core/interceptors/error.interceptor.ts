import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            switch (error.status) {
                case 401:
                    // No autorizado - cerrar sesión y redirigir a login
                    authService.logout();
                    errorMessage = 'Session expired. Please login again.';
                    break;

                case 403:
                    // Prohibido - sin permisos
                    router.navigate(['/unauthorized']);
                    errorMessage = 'You do not have permission to access this resource.';
                    break;

                case 404:
                    // No encontrado
                    errorMessage = 'Resource not found.';
                    break;

                case 500:
                    // Error del servidor
                    errorMessage = 'Server error. Please try again later.';
                    break;

                default:
                    errorMessage = error.error?.message || error.message || 'Unknown error occurred';
            }

            console.error('HTTP Error:', error.status, errorMessage);

            return throwError(() => new Error(errorMessage));
        })
    );
};
