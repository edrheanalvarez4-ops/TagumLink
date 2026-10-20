import { Routes } from '@angular/router';
import { roleGuard } from './core/role.guard';
import { ApplicantHome } from './pages/applicant-home';
import { ApplicantProfile } from './pages/applicant-profile';
import { Browse } from './pages/browse';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { OpportunityDetail } from './pages/opportunity-detail';
import { Register } from './pages/register';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'opportunities' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'opportunities', component: Browse },
  { path: 'opportunities/:id', component: OpportunityDetail },
  { path: 'applicant', component: ApplicantHome, canActivate: [roleGuard('applicant')] },
  { path: 'applicant/profile', component: ApplicantProfile, canActivate: [roleGuard('applicant')] },
  { path: 'employer', component: Dashboard, canActivate: [roleGuard('employer')] },
  { path: 'admin', component: Dashboard, canActivate: [roleGuard('admin')] },
  { path: '**', redirectTo: 'opportunities' },
];