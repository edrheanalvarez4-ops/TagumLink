import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-applicant-home',
  imports: [RouterLink],
  template: `
    <div class="row" style="align-items:center">
      <h2>My Dashboard</h2>
      <span style="text-align:right">
        <a class="btn" routerLink="/applicant/profile">Edit profile</a>
        <a class="btn btn-secondary" routerLink="/opportunities">Browse</a>
      </span>
    </div>

    <h3>Recommended for you</h3>
    @for (r of recs(); track r.id) {
      <div class="card">
        <a [routerLink]="['/opportunities', r.id]"><strong>{{ r.title }}</strong></a>
        <span class="badge" [class]="'badge ' + r.opportunity_type">{{ r.opportunity_type }}</span>
        <div class="muted">{{ r.organization?.organization_name }} · {{ r.location }}</div>
        <div class="muted">Why: {{ r.reasons.join(' · ') }}</div>
      </div>
    } @empty {
      <div class="card muted">
        No recommendations yet. Complete your profile (program, skills, preferred location) to get matches.
      </div>
    }

    <h3>My Applications</h3>
    @for (a of apps(); track a.id) {
      <div class="card">
        <a [routerLink]="['/opportunities', a.opportunity_id]"><strong>{{ a.opportunity?.title }}</strong></a>
        <span class="badge" [class]="'badge ' + a.status">{{ a.status }}</span>
        <div class="muted">{{ a.opportunity?.organization?.organization_name }} · Applied {{ a.applied_at.slice(0, 10) }}</div>
        @if (a.employer_remarks) { <p><strong>Employer remarks:</strong> {{ a.employer_remarks }}</p> }
      </div>
    } @empty {
      <div class="card muted">You haven't applied to anything yet.</div>
    }
  `,
})
export class ApplicantHome implements OnInit {
  private api = inject(ApiService);
  recs = signal<any[]>([]);
  apps = signal<any[]>([]);

  ngOnInit() {
    this.api.get<any[]>('/applicant/recommendations').subscribe((r) => this.recs.set(r));
    this.api.get<any[]>('/applicant/applications').subscribe((a) => this.apps.set(a));
  }
}