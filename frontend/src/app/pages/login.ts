import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card" style="max-width:420px;margin:auto">
      <h2>Login</h2>
      <label>Email</label>
      <input type="email" [(ngModel)]="email" />
      <label>Password</label>
      <input type="password" [(ngModel)]="password" (keyup.enter)="submit()" />
      @if (error()) { <div class="error">{{ error() }}</div> }
      <p><button (click)="submit()" [disabled]="loading()">Login</button></p>
      <p>No account? <a routerLink="/register">Register</a></p>
    </div>
  `,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit() {
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate([this.auth.homeRoute()]),
      error: (e) => {
        this.error.set(e.error?.message ?? 'Login failed.');
        this.loading.set(false);
      },
    });
  }
}