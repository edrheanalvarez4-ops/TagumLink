import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="card">
      <h2>Welcome, {{ auth.user()?.name }}</h2>
      <p>You are logged in as <strong>{{ auth.user()?.role }}</strong>.</p>
    </div>
  `,
})
export class Dashboard {
  auth = inject(AuthService);
}