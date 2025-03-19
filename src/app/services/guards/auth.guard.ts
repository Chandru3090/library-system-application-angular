import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  if (authService.isUserLogedIn()) {
    return true;
  } else {
    authService.navigateToLogin();
    return false;
  }
};
