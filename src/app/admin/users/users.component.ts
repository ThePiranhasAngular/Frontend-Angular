import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'active' | 'inactive';
    lastActive: string;
}

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, AdminNavbarComponent],
    template: `
    <div class="admin-container">
      <app-admin-navbar></app-admin-navbar>

      <main class="admin-main">
        <div class="page-header">
          <div>
            <h1>Users</h1>
            <p class="subtitle">Manage user access and roles</p>
          </div>
          <!-- 
          <button class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add User
          </button>
          -->
        </div>

        <div class="card table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>
                    <div class="user-info">
                      <div class="avatar-sm">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-medium">{{ user.name }}</div>
                        <div class="text-sm text-muted">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class.badge-primary]="user.role === 'ADMIN'" [class.badge-gray]="user.role === 'USER'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" [class.active]="user.status === 'active'">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="text-muted">{{ user.lastActive }}</td>
                  <td class="text-right">
                    <button class="btn-link">Edit</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .admin-container {
      min-height: 100vh;
      background: #F9FAFB;
      font-family: 'Inter', sans-serif;
    }

    .admin-main {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .subtitle {
      color: #6B7280;
      margin: 4px 0 0;
      font-size: 14px;
    }

    .card {
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 16px 24px;
      background: #F9FAFB;
      color: #6B7280;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #E5E7EB;
    }

    td {
      padding: 16px 24px;
      vertical-align: middle;
      border-bottom: 1px solid #F3F4F6;
      color: #374151;
      font-size: 14px;
    }

    tr:last-child td { border-bottom: none; }
    tr:hover { background: #F9FAFB; }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
      background: #E0E7FF;
      color: #4338CA;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .font-medium { font-weight: 500; color: #111827; }
    .text-sm { font-size: 13px; }
    .text-muted { color: #6B7280; }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-primary { background: #EEF2FF; color: #4F46E5; }
    .badge-gray { background: #F3F4F6; color: #4B5563; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
      background: #FEF2F2;
      color: #EF4444;
    }
    .status-badge.active {
      background: #ECFDF5;
      color: #059669;
    }
    .status-badge.active::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #059669;
      margin-right: 6px;
    }

    .btn-link {
      background: none;
      border: none;
      color: #4F46E5;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-link:hover { text-decoration: underline; }

    .text-right { text-align: right; }
  `]
})
export class ManageUsersComponent {
    users = signal<User[]>([
        { id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN', status: 'active', lastActive: '2 mins ago' },
        { id: '2', name: 'Demo User', email: 'user@demo.com', role: 'USER', status: 'active', lastActive: '1 hour ago' },
        { id: '3', name: 'John Doe', email: 'john@example.com', role: 'USER', status: 'inactive', lastActive: '2 days ago' },
        { id: '4', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', status: 'active', lastActive: '5 hours ago' }
    ]);
}
