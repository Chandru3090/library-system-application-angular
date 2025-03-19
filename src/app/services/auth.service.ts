import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StaffMember, ToastType } from '../utils/models';
import { API_BASE_URL } from '../utils/constant';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STAFF_MEMBERS_URL = `${API_BASE_URL}/staff-members`;
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private toastService: NotificationService = inject(NotificationService);

  login(payload: any): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(`${this.STAFF_MEMBERS_URL}?email=${payload?.email}&password=${payload.password}`);
  }

  isUserLogedIn() {
    return localStorage.getItem('loginInfo');
  }

  logout() {
    localStorage.removeItem('loginInfo');
    this.toastService.show('Success', 'Logged out successfully', ToastType.Success);
    this.router.navigate(['/login']);
  }

  setLoginInfo(user: StaffMember) {
    localStorage.setItem('loginInfo', JSON.stringify(user));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  getUserInfo() {
    return JSON.parse(localStorage.getItem('loginInfo') ?? '');
  }

  getUserRole() {
    return JSON.parse(localStorage.getItem('loginInfo') ?? '')?.role;
  }
}
