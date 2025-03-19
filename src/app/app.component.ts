import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { HEADER_MENUS } from './utils/constant';
import { AuthService } from './services/auth.service';
import { ToastNotificationComponent } from './shared/toast-notification/toast-notification.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  menus = HEADER_MENUS;
  constructor(public authService: AuthService, public notificationService: NotificationService) { }
}
