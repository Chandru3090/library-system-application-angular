
import { Injectable } from '@angular/core';
import { Toast, ToastType } from '../utils/models';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    toasts: Toast[] = [];
    constructor() { }

    show(title: string, message: string, type: ToastType, duration: number = 5000) {
        const toast = {
            title,
            message,
            type,
            duration,
            id: new Date().getTime().toString(),
        };
        this.addToast(toast);
    }

    addToast(toast: Toast) {
        // Add toast to the list of toasts
        this.toasts.push(toast);
        // Remove toast after 5 seconds (5000 milliseconds)
        setTimeout(() => {
            this.removeToast(toast.id);
        }, 5000);
    }

    removeToast(toastId: string) {
        // Remove toast from the list of toasts
        this.toasts = this.toasts.filter(toast => toast.id !== toastId);
    }
}