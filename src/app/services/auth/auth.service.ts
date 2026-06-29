
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'https://localhost:7298/api/auth';
  private http = inject(HttpClient);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // ================= AUTH =================
  login(data: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // ================= TOKEN =================
  saveToken(token: string) {
    if (!this.isBrowser()) return;

    localStorage.setItem('token', token);

    const decoded: any = JSON.parse(atob(token.split('.')[1]));

    localStorage.setItem('token_exp', decoded.exp);
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem('token_exp');

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);

    return now > +exp;
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  logout() {
    if (!this.isBrowser()) return;
    localStorage.removeItem('token');
    localStorage.removeItem('token_exp');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= DECODE =================
  private decode(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // ================= USER =================
  getUserId(): string | null {
    return this.decode()?.id || null;
  }

  getUserName(): string | null {
    return this.decode()?.name || null;
  }

  getEmail(): string | null {
    return this.decode()?.email || null;
  }

  getUserRole(): string | null {
    const decoded = this.decode();

    const role =
      decoded?.role ||
      decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    return Array.isArray(role) ? role[0] : role;
  }

  // hasRole(...roles: string[]): boolean {

  //   const role = this.getUserRole();

  //   if (!role)
  //     return false;

  //   return roles.includes(role);

  // }

}
