import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRole = route.data['role'] as 'USER' | 'ADMIN';

    if (!requiredRole) {
        console.warn('RoleGuard: No role specified in route data');
        return true;
    }

    if (authService.hasRole(requiredRole)) {
        return true;
    }

    // Redirigir a página de no autorizado
    router.navigate(['/unauthorized']);
    return false;
};
