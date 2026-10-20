import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-browse',
  imports: [FormsModule, RouterLink],
  template: `
    <h2>Browse Opportunities</h2>
    <div class="card">
      <div class="row">
        <div><label>Search</label><input [(ngModel)]="f.search" placeholder="Title, skills..." /></div>
        <div>
          <label>Type</label>
          <select [(ngModel)]="f.type">
            <option value="">All</option>
            <option value="job">Job</option>
            <option value="internship">Internship / OJT</option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <select [(ngModel)]="f.category_id">
            <option value="">All</option>
            @for (c of categories(); track c.id) { <option [value]="c.id">{{ c.name }}</option> }
          </select>
        </div>
        <div><label>Location</label><input [(ngModel)]="f.location" /></div>
        <div><label>Program</label><input [(ngModel)]="f.program" placeholder="e.g. BSIT" /></div>
      </div>
      <p><button (click)="load(1)">Search</button>
         <button class="btn-secondary" (click)="reset()">Reset</button></p>
    </div>

    @for (o of items(); track o.id) {
      <div class="card">
        <span class="badge" [class]="'badge ' + o.opportunity_type">{{ o.opportunity_type }}</span>
        <h3><a [routerLink]="['/opportunities', o.id]">{{ o.title }}</a></h3>
        <div class="muted">{{ o.organization?.organization_name }} · {{ o.location }}
          @if (o.category) { · {{ o.category.name }} }</div>
        <p>{{ o.description.length > 160 ? o.description.slice(0, 160) + '...' : o.description }}</p>
        <a class="btn" [routerLink]="['/opportunities', o.id]">View details</a>
      </div>
    } @empty {
      <div class="card">No opportunities found.</div>
    }

    @if (lastPage() > 1) {
      <div class="pager">
        <button [disabled]="page() <= 1" (click)="load(page() - 1)">Previous</button>
        <span>Page {{ page() }} of {{ lastPage() }}</span>
        <button [disabled]="page() >= lastPage()" (click)="load(page() + 1)">Next</button>
      </div>
    }
  `,
})
export class Browse implements OnInit {
  private api = inject(ApiService);

  f = { search: '', type: '', category_id: '', location: '', program: '' };
  items = signal<any[]>([]);
  categories = signal<any[]>([]);
  page = signal(1);
  lastPage = signal(1);

  ngOnInit() {
    this.api.get<any[]>('/categories').subscribe((c) => this.categories.set(c));
    this.load(1);
  }

  load(page: number) {
    this.api.get<any>('/opportunities', { ...this.f, page }).subscribe((res) => {
      this.items.set(res.data);
      this.page.set(res.current_page);
      this.lastPage.set(res.last_page);
    });
  }

  reset() {
    this.f = { search: '', type: '', category_id: '', location: '', program: '' };
    this.load(1);
  }
}