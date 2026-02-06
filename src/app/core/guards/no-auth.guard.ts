import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Si ya está autenticado, redirigir según su rol
    const role = authService.userRole();
    if (role === 'ADMIN') {
        router.navigate(['/admin/dashboard']);
    } else {
        router.navigate(['/menu']);
    }

    return false;
};
