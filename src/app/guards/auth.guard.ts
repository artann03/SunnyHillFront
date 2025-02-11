import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(route.routeConfig?.path || '');

    if (isAuthRoute) {
      if (isLoggedIn) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
} 