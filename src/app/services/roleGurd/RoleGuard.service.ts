import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const userRole = this.auth.getUserRole();
    const allowedRoles = route.data['roles'] as string[];

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // Admin يدخل كل حاجة
    if (userRole === 'Admin') {
      return true;
    }

    // check allowed roles
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
