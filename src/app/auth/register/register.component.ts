import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <!-- Logo -->
        <div class="auth-logo">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 class="logo-text">RestorApp</h1>
          <p class="auth-subtitle">Create your account</p>
        </div>

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Full Name -->
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-icon-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input 
                type="text" 
                class="form-control" 
                formControlName="name"
                placeholder="e.g. John Doe"
              >
            </div>
            @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
              <small class="text-danger">Name is required</small>
            }
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-icon-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input 
                type="email" 
                class="form-control" 
                formControlName="email"
                placeholder="name@example.com"
              >
            </div>
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <small class="text-danger">Please enter a valid email</small>
            }
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input 
                type="password" 
                class="form-control" 
                formControlName="password"
                placeholder="Min. 6 characters"
              >
            </div>
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <small class="text-danger">Password must be at least 6 characters</small>
            }
          </div>

          <!-- Role Selector -->
          <div class="form-group">
            <label class="form-label">Select Role</label>
            <div class="input-icon-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <select class="form-control form-select" formControlName="role">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <!-- Error Message -->
          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn btn-primary btn-block btn-lg"
            [disabled]="registerForm.invalid || isLoading"
          >
            @if (isLoading) {
              <span class="spinner-small"></span>
            }
            Sign Up
          </button>
        </form>

        <!-- Login Link -->
        <p class="auth-footer">
          Already have an account? <a routerLink="/auth/login">Sign in</a>
        </p>
      </div>

      <!-- Footer -->
      <p class="auth-copyright">RestorApp Académico Simulacro</p>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--gray-100);
      padding: var(--spacing-md);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-lg);
    }

    .auth-logo {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-green-light);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-sm);
      color: var(--primary-green);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .auth-subtitle {
      color: var(--gray-500);
      font-size: 0.875rem;
      margin-top: var(--spacing-xs);
    }

    .auth-form {
      margin-bottom: var(--spacing-lg);
    }

    .error-message {
      background-color: var(--status-cancelled-bg);
      color: var(--status-cancelled);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      margin-bottom: var(--spacing-md);
    }

    .auth-footer {
      text-align: center;
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .auth-copyright {
      margin-top: var(--spacing-lg);
      font-size: 0.75rem;
      color: var(--gray-400);
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: var(--spacing-sm);
    }
  `]
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor() {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['USER']
        });
    }

    onSubmit(): void {
        if (this.registerForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = '';

        const formData = this.registerForm.value;

        this.authService.register(formData).subscribe({
            next: () => {
                const role = this.authService.userRole();
                if (role === 'ADMIN') {
                    this.router.navigate(['/admin/dashboard']);
                } else {
                    this.router.navigate(['/menu']);
                }
            },
            error: (err) => {
                this.errorMessage = err.message || 'Registration failed. Please try again.';
                this.isLoading = false;
            }
        });
    }
}
