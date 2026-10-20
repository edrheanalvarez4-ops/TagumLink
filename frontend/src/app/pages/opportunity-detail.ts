import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-opportunity-detail',
  imports: [FormsModule, RouterLink],
  template: `
    @if (o(); as op) {
      <div class="card">
        <span class="badge" [class]="'badge ' + op.opportunity_type">{{ op.opportunity_type }}</span>
        <h2>{{ op.title }}</h2>
        <div class="muted">{{ op.organization?.organization_name }} · {{ op.location }}
          @if (op.category) { · {{ op.category.name }} }</div>

        <h4>Description</h4><p>{{ op.description }}</p>
        @if (op.requirements) { <h4>Requirements</h4><p>{{ op.requirements }}</p> }
        @if (op.required_skills) { <h4>Required skills</h4><p>{{ op.required_skills }}</p> }
        @if (op.academic_program) { <h4>Relevant program</h4><p>{{ op.academic_program }}</p> }
        <p class="muted">Available slots: {{ op.slots }}
          @if (op.deadline) { · Deadline: {{ op.deadline.slice(0, 10) }} }</p>
      </div>

      <div class="card">
        @if (!auth.isLoggedIn) {
          <p>Please <a routerLink="/login">log in</a> as an applicant to apply.</p>
        } @else if (auth.user()?.role === 'applicant') {
          <h3>Apply</h3>
          <label>Cover letter (optional)</label>
          <textarea rows="4" [(ngModel)]="coverLetter"></textarea>
          @if (message()) { <div class="success">{{ message() }}</div> }
          @if (error()) { <div class="error">{{ error() }}</div> }
          <p><button (click)="apply()" [disabled]="sent()">Submit application</button></p>
        } @else {
          <p class="muted">Only applicant accounts can apply.</p>
        }
      </div>
    } @else {
      <div class="card">Loading...</div>
    }
  `,
})
export class OpportunityDetail implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  o = signal<any>(null);
  coverLetter = '';
  message = signal('');
  error = signal('');
  sent = signal(false);
  id = this.route.snapshot.paramMap.get('id');

  ngOnInit() {
    this.api.get<any>(`/opportunities/${this.id}`).subscribe({
      next: (res) => this.o.set(res),
      error: () => this.error.set('Listing not found or no longer open.'),
    });
  }

  apply() {
    this.message.set('');
    this.error.set('');
    this.api
      .post(`/applicant/opportunities/${this.id}/apply`, { cover_letter: this.coverLetter })
      .subscribe({
        next: () => {
          this.message.set('Application submitted! Track it from your dashboard.');
          this.sent.set(true);
        },
        error: (e) => this.error.set(e.error?.message ?? 'Could not submit application.'),
      });
  }
}