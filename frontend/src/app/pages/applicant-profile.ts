import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-applicant-profile',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card" style="max-width:600px;margin:auto">
      <h2>My Profile</h2>
      <label>Phone</label><input [(ngModel)]="p.phone" />
      <label>Education level</label><input [(ngModel)]="p.education_level" placeholder="e.g. College" />
      <label>Academic program</label><input [(ngModel)]="p.academic_program" placeholder="e.g. BSIT" />
      <label>School name</label><input [(ngModel)]="p.school_name" />
      <label>Skills (separate with commas)</label>
      <textarea rows="2" [(ngModel)]="p.skills" placeholder="PHP, Laravel, Angular, MySQL"></textarea>
      <label>Experience</label><textarea rows="3" [(ngModel)]="p.experience"></textarea>
      <label>Preferred location</label><input [(ngModel)]="p.preferred_location" placeholder="e.g. Tagum City" />
      @if (message()) { <div class="success">{{ message() }}</div> }
      @for (e of errors(); track e) { <div class="error">{{ e }}</div> }
      <p><button (click)="save()">Save profile</button>
         <a class="btn btn-secondary" routerLink="/applicant">Back</a></p>
    </div>
  `,
})
export class ApplicantProfile implements OnInit {
  private api = inject(ApiService);

  p: any = {
    phone: '', education_level: '', academic_program: '',
    school_name: '', skills: '', experience: '', preferred_location: '',
  };
  message = signal('');
  errors = signal<string[]>([]);

  ngOnInit() {
    this.api.get<any>('/applicant/profile').subscribe((res) => {
      if (res) this.p = { ...this.p, ...res };
    });
  }

  save() {
    this.message.set('');
    this.errors.set([]);
    this.api.put('/applicant/profile', this.p).subscribe({
      next: () => this.message.set('Profile saved.'),
      error: (e) =>
        this.errors.set(e.error?.errors ? Object.values<string[]>(e.error.errors).flat() : ['Could not save.']),
    });
  }
}