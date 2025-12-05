import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return '';
    }
  }

  getStyles(type: string) {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success/10',
          border: 'border-success',
          icon: 'text-success',
          text: 'text-text'
        };
      case 'error':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger',
          icon: 'text-danger',
          text: 'text-text'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning',
          icon: 'text-warning',
          text: 'text-text'
        };
      case 'info':
        return {
          bg: 'bg-info/10',
          border: 'border-info',
          icon: 'text-info',
          text: 'text-text'
        };
      default:
        return {
          bg: 'bg-text/10',
          border: 'border-text/20',
          icon: 'text-text/60',
          text: 'text-text'
        };
    }
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}

