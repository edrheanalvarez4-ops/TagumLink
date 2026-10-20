import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="nav">
      <a routerLink="/" class="brand">TagumLink</a>
      <a routerLink="/opportunities">Browse</a>
      <span class="spacer"></span>
      @if (auth.user(); as u) {
        <a [routerLink]="auth.homeRoute()">Dashboard</a>
        <span>{{ u.name }} ({{ u.role }})</span>
        <button (click)="auth.logout()">Logout</button>
      } @else {
        <a routerLink="/login">Login</a>
        <a routerLink="/register">Register</a>
      }
    </nav>
    <div class="container">
      <router-outlet />
    </div>
  `,
  styles: `
    .nav { display: flex; gap: 16px; align-items: center; background: #102a43; color: #fff; padding: 12px 24px; }
    .nav a { color: #fff; text-decoration: none; }
    .brand { font-weight: 700; font-size: 1.2rem; }
    .spacer { flex: 1; }
  `,
})
export class App {
  auth = inject(AuthService);
}