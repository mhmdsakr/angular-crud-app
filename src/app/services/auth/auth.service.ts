import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private baseUrl = 'https://localhost:7298/api/auth';


  http = inject(HttpClient);

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  saveAuth(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.roles?.[0] || null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  logout() {
    localStorage.clear();
  }
}
