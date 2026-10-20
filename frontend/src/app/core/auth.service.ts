import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'applicant' | 'employer' | 'admin';
  status: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly api = 'http://127.0.0.1:8000/api';
  user = signal<User | null>(this.loadUser());

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token && !!this.user();
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.api}/login`, { email, password })
      .pipe(tap((res) => this.save(res)));
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'applicant' | 'employer';
  }) {
    return this.http
      .post<AuthResponse>(`${this.api}/register`, data)
      .pipe(tap((res) => this.save(res)));
  }

  logout() {
    this.http.post(`${this.api}/logout`, {}).subscribe({ error: () => {} });
    this.clear();
    this.router.navigate(['/login']);
  }

  // Where each role lands after login
  homeRoute(): string {
    switch (this.user()?.role) {
      case 'employer': return '/employer';
      case 'admin': return '/admin';
      default: return '/applicant';
    }
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }

  private save(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.user.set(res.user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}