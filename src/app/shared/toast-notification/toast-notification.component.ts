import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Toast, ToastType } from '../../utils/models';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss'
})
export class ToastNotificationComponent {
  TOAST_TYPES = ToastType;
  @Input() toasts: Toast[] = [];
  private toastService: NotificationService = inject(NotificationService);
  constructor() { }

  removeToast(toastId: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== toastId);
    this.toastService.removeToast(toastId);
  }
}
