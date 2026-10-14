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

  // Forgot Password Modal State
  showForgotModal = false;
  resetEmail = '';
  newPassword = '';
  confirmNewPassword = '';
  resetError = '';
  resetSuccess = '';
  isResetting = false;

  openForgotModal() {
    this.showForgotModal = true;
    this.resetEmail = this.email || '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.resetError = '';
    this.resetSuccess = '';
  }

  closeForgotModal() {
    this.showForgotModal = false;
  }

  onResetSubmit() {
    this.resetError = '';
    this.resetSuccess = '';

    if (!this.resetEmail.trim()) {
      this.resetError = 'Please enter your registered email address.';
      return;
    }

    if (!this.newPassword || this.newPassword.length < 8) {
      this.resetError = 'New password must be at least 8 characters long.';
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.resetError = 'Passwords do not match. Please try again.';
      return;
    }

    this.isResetting = true;

    this.userService.resetPassword(this.resetEmail.trim(), this.newPassword).subscribe({
      next: (res) => {
        this.isResetting = false;
        this.resetSuccess = res.message || 'Password reset successfully!';
        this.email = this.resetEmail.trim();
        this.password = this.newPassword;
        setTimeout(() => {
          this.closeForgotModal();
          this.successMessage = 'Your password has been reset! Click Log In below to continue.';
        }, 1500);
      },
      error: (err) => {
        this.isResetting = false;
        this.resetError = err.error?.error || 'Failed to reset password. Please verify your email address.';
      }
    });
  }

  setRole(selectedRole: 'consumer' | 'business_owner') {
    this.role = selectedRole;
    this.errorMessage = '';
  }

  useDemoConsumer() {
    this.role = 'consumer';
    this.email = 'jessica@example.com';
    this.password = 'password123';
    this.onSubmit();
  }

  useDemoBusinessOwner() {
    this.role = 'business_owner';
    this.email = 'elias@woodworks.com';
    this.password = 'artisan2026';
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

    this.userService.loginWithRole({
      email: this.email.trim(),
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        const roleTitle = this.role === 'business_owner' ? 'Business Owner' : 'Consumer';
        const destination = this.role === 'business_owner' ? 'Business Dashboard' : 'Consumer Profile';

        this.successMessage = `Logged in as ${roleTitle}! Redirecting to ${destination}...`;

        setTimeout(() => {
          this.router.navigate([res.targetRoute]);
        }, 900);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Login failed. Please check your credentials and try again.';
      }
    });
  }
}
