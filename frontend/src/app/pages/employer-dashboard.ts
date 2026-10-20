
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-employer-dashboard',
  imports: [FormsModule],
  template: `
    <div class="row" style="align-items:center">
      <div>
        <h2>Employer Dashboard</h2>
        <p class="muted">Welcome, {{ auth.user()?.name }}.</p>
      </div>
      <div style="text-align:right">
        <button class="btn-secondary" (click)="auth.logout()">Log out</button>
      </div>
    </div>

    @if (message()) {
      <div class="card success">{{ message() }}</div>
    }

    @for (error of errors(); track error) {
      <div class="card error">{{ error }}</div>
    }

    <div class="card">
      <h3>Organization Profile</h3>
      <p class="muted">
        Complete your organization details before publishing opportunities.
      </p>

      <label>Organization Name *</label>
      <input
        [(ngModel)]="organization.organization_name"
        placeholder="Enter organization or company name"
      />

      <label>Description</label>
      <textarea
        rows="3"
        [(ngModel)]="organization.description"
        placeholder="Describe your organization"
      ></textarea>

      <div class="row">
        <div>
          <label>Contact Email</label>
          <input
            type="email"
            [(ngModel)]="organization.email"
            placeholder="company@example.com"
          />
        </div>
        <div>
          <label>Contact Number</label>
          <input
            [(ngModel)]="organization.phone"
            placeholder="Organization contact number"
          />
        </div>
      </div>

      <label>Address</label>
      <input
        [(ngModel)]="organization.address"
        placeholder="e.g. Tagum City, Davao del Norte"
      />

      <p>
        <button (click)="saveOrganization()" [disabled]="savingOrganization()">
          {{ savingOrganization() ? 'Saving...' : 'Save Organization' }}
        </button>
      </p>
    </div>

    <div class="card">
      <div class="row" style="align-items:center">
        <div>
          <h3>My Opportunities</h3>
          <p class="muted">Manage your job and internship/OJT listings.</p>
        </div>
        <div style="text-align:right">
          <button (click)="newOpportunity()">+ Create Opportunity</button>
        </div>
      </div>

      @if (loading()) {
        <p>Loading your opportunities...</p>
      } @else if (opportunities().length === 0) {
        <p class="muted">
          You have not created any opportunities yet. Select
          "Create Opportunity" to add your first listing.
        </p>
      } @else {
        @for (item of opportunities(); track item.id) {
          <div class="card">
            <div class="row" style="align-items:center">
              <div>
                <span
                  class="badge"
                  [class]="'badge ' + item.opportunity_type"
                >
                  {{ item.opportunity_type }}
                </span>
                <span
                  class="badge"
                  [class]="'badge ' + item.status"
                >
                  {{ item.status }}
                </span>
                <h3>{{ item.title }}</h3>
                <div class="muted">
                  {{ item.location }}
                  · {{ item.slots }} slot(s)
                  @if (item.deadline) {
                    · Deadline: {{ item.deadline }}
                  }
                </div>
                @if (item.category?.name) {
                  <div class="muted">Category: {{ item.category.name }}</div>
                }
              </div>
            </div>

            <p>{{ item.description }}</p>

            <div class="row">
              <div>
                <button (click)="editOpportunity(item)">Edit</button>
                <button
                  class="btn-secondary"
                  (click)="toggleStatus(item)"
                  [disabled]="busy()"
                >
                  {{ item.status === 'open' ? 'Close Listing' : 'Reopen Listing' }}
                </button>
              </div>
              <div style="text-align:right">
                <button
                  style="background:#b42318"
                  (click)="deleteOpportunity(item)"
                  [disabled]="busy()"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>

    @if (showForm()) {
      <div class="card">
        <h3>
          {{ editingId() ? 'Edit Opportunity' : 'Create Opportunity' }}
        </h3>

        <p class="muted">
          Fields marked with * are required.
        </p>

        <label>Opportunity Title *</label>
        <input
          [(ngModel)]="form.title"
          placeholder="e.g. Junior Web Developer"
        />

        <div class="row">
          <div>
            <label>Opportunity Type *</label>
            <select [(ngModel)]="form.opportunity_type">
              <option value="job">Job</option>
              <option value="internship">Internship / OJT</option>
            </select>
          </div>
          <div>
            <label>Category</label>
            <select [(ngModel)]="form.category_id">
              <option value="">No category</option>
              @for (category of categories(); track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>
        </div>

        <label>Description *</label>
        <textarea
          rows="4"
          [(ngModel)]="form.description"
          placeholder="Describe the job or internship"
        ></textarea>

        <label>Requirements</label>
        <textarea
          rows="3"
          [(ngModel)]="form.requirements"
          placeholder="Qualifications and requirements"
        ></textarea>

        <label>Required Skills</label>
        <textarea
          rows="2"
          [(ngModel)]="form.required_skills"
          placeholder="e.g. HTML, CSS, JavaScript"
        ></textarea>

        <label>Preferred Academic Program</label>
        <input
          [(ngModel)]="form.academic_program"
          placeholder="e.g. BSIT; leave blank if not applicable"
        />

        <label>Location *</label>
        <input
          [(ngModel)]="form.location"
          placeholder="e.g. Tagum City"
        />

        <div class="row">
          <div>
            <label>Number of Slots *</label>
            <input
              type="number"
              min="1"
              [(ngModel)]="form.slots"
            />
          </div>
          <div>
            <label>Application Deadline</label>
            <input
              type="date"
              [(ngModel)]="form.deadline"
            />
          </div>
        </div>

        <label>Listing Status *</label>
        <select [(ngModel)]="form.status">
          <option value="draft">Draft</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <p>
          <button (click)="saveOpportunity()" [disabled]="busy()">
            {{ busy() ? 'Saving...' : 'Save Opportunity' }}
          </button>
          <button class="btn-secondary" (click)="cancelForm()" [disabled]="busy()">
            Cancel
          </button>
        </p>
      </div>
    }
  `,
})
export class EmployerDashboard implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);

  opportunities = signal<any[]>([]);
  categories = signal<any[]>([]);

  loading = signal(false);
  busy = signal(false);
  savingOrganization = signal(false);
  showForm = signal(false);
  editingId = signal<number | null>(null);

  message = signal('');
  errors = signal<string[]>([]);

  organization: any = this.emptyOrganization();
  form: any = this.emptyOpportunity();

  ngOnInit(): void {
    this.loadOrganization();
    this.loadCategories();
    this.loadOpportunities();
  }

  private emptyOrganization() {
    return {
      organization_name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
    };
  }

  private emptyOpportunity() {
    return {
      category_id: '',
      title: '',
      opportunity_type: 'job',
      description: '',
      requirements: '',
      required_skills: '',
      academic_program: '',
      location: '',
      slots: 1,
      deadline: '',
      status: 'draft',
    };
  }

  private clearFeedback(): void {
    this.message.set('');
    this.errors.set([]);
  }

  private showApiError(error: any, fallback: string): void {
    const validationErrors = error?.error?.errors;

    if (validationErrors) {
      this.errors.set(
        Object.values(validationErrors as Record<string, string[]>).flat()
      );
    } else {
      this.errors.set([error?.error?.message || fallback]);
    }
  }

  loadOrganization(): void {
    this.api.get<any>('/employer/organization').subscribe({
      next: (result) => {
        if (result) {
          this.organization = {
            ...this.emptyOrganization(),
            ...result,
          };
        }
      },
      error: (error) => {
        this.clearFeedback();
        this.showApiError(error, 'Could not load organization details.');
      },
    });
  }

  saveOrganization(): void {
    this.clearFeedback();

    if (!this.organization.organization_name.trim()) {
      this.errors.set(['Organization name is required.']);
      return;
    }

    this.savingOrganization.set(true);

    this.api.put('/employer/organization', this.organization).subscribe({
      next: (result: any) => {
        this.organization = {
          ...this.emptyOrganization(),
          ...result,
        };
        this.message.set('Organization profile saved successfully.');
        this.savingOrganization.set(false);
      },
      error: (error) => {
        this.showApiError(error, 'Could not save organization details.');
        this.savingOrganization.set(false);
      },
    });
  }

  loadCategories(): void {
    this.api.get<any[]>('/categories').subscribe({
      next: (result) => this.categories.set(result),
      error: () => {
        this.errors.set(['Could not load opportunity categories.']);
      },
    });
  }

  loadOpportunities(): void {
    this.loading.set(true);

    this.api.get<any[]>('/employer/opportunities').subscribe({
      next: (result) => {
        this.opportunities.set(result);
        this.loading.set(false);
      },
      error: (error) => {
        this.showApiError(error, 'Could not load your opportunities.');
        this.loading.set(false);
      },
    });
  }

  newOpportunity(): void {
    this.clearFeedback();
    this.editingId.set(null);
    this.form = this.emptyOpportunity();
    this.showForm.set(true);
  }

  editOpportunity(item: any): void {
    this.clearFeedback();
    this.editingId.set(item.id);

    this.form = {
      ...this.emptyOpportunity(),
      ...item,
      category_id: item.category_id == null ? '' : String(item.category_id),
      deadline: item.deadline ? String(item.deadline).slice(0, 10) : '',
    };

    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = this.emptyOpportunity();
    this.clearFeedback();
  }

  saveOpportunity(): void {
    this.clearFeedback();

    if (
      !this.form.title.trim() ||
      !this.form.description.trim() ||
      !this.form.location.trim()
    ) {
      this.errors.set([
        'Title, description, and location are required.',
      ]);
      return;
    }

    const slots = Number(this.form.slots);

    if (!Number.isInteger(slots) || slots < 1) {
      this.errors.set(['Number of slots must be at least 1.']);
      return;
    }

    const payload = {
      ...this.form,
      category_id: this.form.category_id
        ? Number(this.form.category_id)
        : null,
      slots,
      deadline: this.form.deadline || null,
    };

    this.busy.set(true);
    const id = this.editingId();

    const request = id
      ? this.api.put(`/employer/opportunities/${id}`, payload)
      : this.api.post('/employer/opportunities', payload);

    request.subscribe({
      next: () => {
        this.message.set(
          id
            ? 'Opportunity updated successfully.'
            : 'Opportunity created successfully.'
        );
        this.showForm.set(false);
        this.editingId.set(null);
        this.form = this.emptyOpportunity();
        this.busy.set(false);
        this.loadOpportunities();
      },
      error: (error) => {
        this.showApiError(error, 'Could not save the opportunity.');
        this.busy.set(false);
      },
    });
  }

  toggleStatus(item: any): void {
    this.clearFeedback();

    const newStatus = item.status === 'open' ? 'closed' : 'open';

    const payload = {
      category_id: item.category_id ?? null,
      title: item.title,
      opportunity_type: item.opportunity_type,
      description: item.description,
      requirements: item.requirements ?? '',
      required_skills: item.required_skills ?? '',
      academic_program: item.academic_program ?? '',
      location: item.location,
      slots: item.slots,
      deadline: item.deadline
        ? String(item.deadline).slice(0, 10)
        : null,
      status: newStatus,
    };

    this.busy.set(true);

    this.api.put(`/employer/opportunities/${item.id}`, payload).subscribe({
      next: () => {
        this.message.set(`Opportunity status changed to ${newStatus}.`);
        this.busy.set(false);
        this.loadOpportunities();
      },
      error: (error) => {
        this.showApiError(error, 'Could not change the listing status.');
        this.busy.set(false);
      },
    });
  }

  deleteOpportunity(item: any): void {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.clearFeedback();
    this.busy.set(true);

    this.api.delete(`/employer/opportunities/${item.id}`).subscribe({
      next: () => {
        this.message.set('Opportunity deleted successfully.');
        this.busy.set(false);
        this.loadOpportunities();
      },
      error: (error) => {
        this.showApiError(error, 'Could not delete the opportunity.');
        this.busy.set(false);
      },
    });
  }
}
