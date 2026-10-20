import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card" style="max-width:420px;margin:auto">
      <h2>Create an account</h2>
      <label>I am a</label>
      <select [(ngModel)]="form.role">
        <option value="applicant">Student / Job Seeker</option>
        <option value="employer">Employer / Internship Provider</option>
      </select>
      <label>Full name</label>
      <input [(ngModel)]="form.name" />
      <label>Email</label>
      <input type="email" [(ngModel)]="form.email" />
      <label>Password (min. 8 characters)</label>
      <input type="password" [(ngModel)]="form.password" />
      <label>Confirm password</label>
      <input type="password" [(ngModel)]="form.password_confirmation" />
      @for (msg of errors(); track msg) { <div class="error">{{ msg }}</div> }
      <p><button (click)="submit()" [disabled]="loading()">Register</button></p>
      <p>Already registered? <a routerLink="/login">Login</a></p>
    </div>
  `,
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  form = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'applicant' as 'applicant' | 'employer',
  };
  errors = signal<string[]>([]);
  loading = signal(false);

  submit() {
    this.errors.set([]);
    this.loading.set(true);
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate([this.auth.homeRoute()]),
      error: (e) => {
        const list: string[] = e.error?.errors
          ? Object.values<string[]>(e.error.errors).flat()
          : [e.error?.message ?? 'Registration failed.'];
        this.errors.set(list);
        this.loading.set(false);
      },
    });
  }
}