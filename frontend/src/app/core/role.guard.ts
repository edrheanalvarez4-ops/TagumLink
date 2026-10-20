import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard = (role: 'applicant' | 'employer' | 'admin'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn) {
      return router.createUrlTree(['/login']);
    }

    if (auth.user()?.role !== role) {
      return router.createUrlTree([auth.homeRoute()]);
    }

    return true;
  };
};