import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  userService = inject(UserService);
  router = inject(Router);

  role: 'consumer' | 'business_owner' = 'consumer';
  email = '';
  password = '';
  rememberMe = true;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  setRole(selectedRole: 'consumer' | 'business_owner') {
    this.role = selectedRole;
    this.errorMessage = '';
  }

  useDemoConsumer() {
    this.role = 'consumer';
    this.email = 'jessica.m@example.com';
    this.password = 'password123';
    this.onSubmit();
  }

  useDemoBusinessOwner() {
    this.role = 'business_owner';
    this.email = 'elias.woodworks@example.com';
    this.password = 'password123';
    this.onSubmit();
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const res = this.userService.loginWithRole({
        email: this.email.trim(),
        role: this.role
      });

      const roleTitle = res.detectedRole === 'business_owner' ? 'Business Owner' : 'Consumer';
      const destination = res.detectedRole === 'business_owner' ? 'Business Dashboard' : 'Consumer Profile';

      this.successMessage = `Logged in as ${roleTitle}! Redirecting to ${destination}...`;

      setTimeout(() => {
        this.router.navigate([res.targetRoute]);
      }, 900);
    }, 400);
  }
}
