import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { STAFF_MEMBERS_ROLE } from '../../utils/constant';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isUserLogedIn()) {
    return false;
    router.navigate(['/login']);
  } else {
    const role = JSON.parse(authService.isUserLogedIn() ?? '')?.role;
    return (role === STAFF_MEMBERS_ROLE[0]);
  }
};
