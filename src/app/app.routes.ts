import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// User
import { MenuComponent } from './user/menu/menu.component';
import { MyOrdersComponent } from './user/my-orders/my-orders.component';
import { OrderDetailComponent } from './user/order-detail/order-detail.component';

// Admin
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageProductsComponent } from './admin/products/products.component';
import { ManageUsersComponent } from './admin/users/users.component';

// Shared
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

export const routes: Routes = [
    // Default redirect
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

    // Auth routes (NoAuthGuard - only accessible when NOT logged in)
    {
        path: 'auth/login',
        component: LoginComponent,
        canActivate: [noAuthGuard]
    },
    {
        path: 'auth/register',
        component: RegisterComponent,
        canActivate: [noAuthGuard]
    },

    // User routes (AuthGuard - requires authentication)
    {
        path: 'menu',
        component: MenuComponent,
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        component: MyOrdersComponent,
        canActivate: [authGuard]
    },
    {
        path: 'orders/:id',
        component: OrderDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: MyOrdersComponent, // Using MyOrders which includes profile section
        canActivate: [authGuard]
    },

    // Admin routes (AuthGuard + RoleGuard)
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { role: 'ADMIN' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'products', component: ManageProductsComponent },
            { path: 'orders', component: AdminDashboardComponent }, // Uses same dashboard for now
            { path: 'users', component: ManageUsersComponent }
        ]
    },

    // Error pages
    { path: 'unauthorized', component: UnauthorizedComponent },

    // Fallback - redirect to login
    { path: '**', redirectTo: '/auth/login' }
];
