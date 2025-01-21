import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StaffMember } from '../utils/models';
import { API_BASE_URL } from '../utils/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STAFF_MEMBERS_URL = `${API_BASE_URL}/staff-members`;
  constructor(private router: Router, private http: HttpClient) { }

  login(payload: any): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(`${this.STAFF_MEMBERS_URL}?email=${payload?.email}&password=${payload.password}`);
  }

  isUserLogedIn() {
    return localStorage.getItem('loginInfo');
  }

  logout() {
    localStorage.removeItem('loginInfo');
    this.router.navigate(['/login']);
  }

  setLoginInfo(user: StaffMember) {
    localStorage.setItem('loginInfo', JSON.stringify(user));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
