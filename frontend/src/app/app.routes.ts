import { Routes } from '@angular/router';
import { Home } from './home/home';
import { UserProfileComponent } from './user-profile/user-profile';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard';
import { AdminPortalComponent } from './admin-portal/admin-portal';
import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'admin', component: AdminPortalComponent },
  { path: 'business-dashboard', component: BusinessDashboardComponent },
  { path: 'business-dashboard/:businessName', component: BusinessDashboardComponent },
  { path: 'business/:businessName', component: BusinessDashboardComponent },
  { path: 'dashboard', component: BusinessDashboardComponent },
  { path: '**', redirectTo: '' }
];
