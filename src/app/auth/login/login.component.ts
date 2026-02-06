import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <p class="auth-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Email -->
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
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
                placeholder="nombre@ejemplo.com"
              >
            </div>
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <small class="text-danger">Ingresa un correo válido</small>
            }
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Contraseña</label>
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
                placeholder="••••••••"
              >
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
            [disabled]="loginForm.invalid || isLoading"
          >
            @if (isLoading) {
              <span class="spinner-small"></span>
            }
            Iniciar sesión
          </button>
        </form>

        <!-- Register Link -->
        <p class="auth-footer">
          ¿No tienes una cuenta? <a routerLink="/auth/register">Regístrate</a>
        </p>

        <!-- Demo Credentials -->
        <div class="demo-credentials">
          <p class="text-sm text-muted">Credenciales de demostración:</p>
          <p class="text-xs">Usuario: user&#64;demo.com / 123456</p>
          <p class="text-xs">Administrador: admin&#64;demo.com / 123456</p>
        </div>
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

    .demo-credentials {
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--gray-200);
      text-align: center;
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/menu';
        const role = this.authService.userRole();

        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate([returnUrl]);
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al iniciar sesión. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
