import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { Home } from './home/home';
import { UserProfileComponent } from './user-profile/user-profile';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard';
import { AdminPortalComponent } from './admin-portal/admin-portal';
import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';
import { AboutComponent } from './about/about';
import { ContactComponent } from './contact/contact';
import { BrowseHandiworksComponent } from './browse-handiworks/browse-handiworks';
import { CategoriesPageComponent } from './categories/categories';

/**
 * Business Owner Guard:
 * Blocks Consumers from accessing the Business Dashboard.
 * Redirects Consumers to /profile.
 * Redirects unauthenticated users to /login.
 */
const businessOwnerGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Consumers MUST NOT access business owner dashboard
  if (userService.userRole() === 'consumer') {
    alert('Access Restricted: Consumer accounts cannot access the Business Owner Dashboard.');
    router.navigate(['/profile']);
    return false;
  }

  // Only business_owner role is permitted
  if (userService.userRole() !== 'business_owner') {
    router.navigate(['/profile']);
    return false;
  }
  return true;
};

/**
 * Consumer Guard:
 * Prevents Business Owners from accessing the Consumer Profile.
 * Redirects Business Owners to /business-dashboard.
 */
const consumerGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLoggedIn() && userService.userRole() === 'business_owner') {
    router.navigate(['/business-dashboard']);
    return false;
  }
  return true;
};

/**
 * Admin Guard:
 * Blocks both Consumers and Business Owners from accessing the Admin Portal,
 * unless explicitly authorized as a Platform Administrator.
 */
const adminGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  // Consumers CANNOT access admin page under any circumstances
  if (userService.isLoggedIn() && userService.userRole() === 'consumer') {
    alert('Access Denied: Consumer accounts are not permitted to access the Platform Admin Control Center.');
    router.navigate(['/profile']);
    return false;
  }

  // Business Owners CANNOT access admin page under any circumstances
  if (userService.isLoggedIn() && userService.userRole() === 'business_owner') {
    alert('Access Denied: Business Owner accounts are not permitted to access the Platform Admin Control Center.');
    router.navigate(['/business-dashboard']);
    return false;
  }

  return true;
};

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'browse', component: BrowseHandiworksComponent },
  { path: 'browse-handiworks', component: BrowseHandiworksComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [consumerGuard] },
  { path: 'admin', component: AdminPortalComponent, canActivate: [adminGuard] },
  { path: 'business-dashboard', component: BusinessDashboardComponent, canActivate: [businessOwnerGuard] },
  { path: 'business-dashboard/:businessName', component: BusinessDashboardComponent, canActivate: [businessOwnerGuard] },
  { path: 'business/:businessName', component: BusinessDashboardComponent, canActivate: [businessOwnerGuard] },
  { path: 'dashboard', component: BusinessDashboardComponent, canActivate: [businessOwnerGuard] },
  { path: '**', redirectTo: '' }
];
