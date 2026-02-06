import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus, ORDER_STATUS_CONFIG } from '../../../core/models';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="badge" [ngClass]="config.class">
      {{ config.label }}
    </span>
  `,
    styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 9999px;
    }
  `]
})
export class StatusBadgeComponent {
    @Input({ required: true }) status!: OrderStatus;

    get config() {
        return ORDER_STATUS_CONFIG[this.status];
    }
}
