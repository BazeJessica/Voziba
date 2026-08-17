import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WorksService } from '../services/works.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  userService = inject(UserService);
  worksService = inject(WorksService);
  router = inject(Router);

  role: 'consumer' | 'business_owner' = 'consumer';
  name = '';
  email = '';
  phone = '';
  businessName = '';
  category = 'Woodworking & Furniture';
  password = '';
  confirmPassword = '';
  agreeTerms = true;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  categories = this.worksService.categories;

  setRole(selectedRole: 'consumer' | 'business_owner') {
    this.role = selectedRole;
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.password) {
      this.errorMessage = 'Please fill in all required fields (Full Name, Email, Password).';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please double check.';
      return;
    }

    if (!this.agreeTerms) {
      this.errorMessage = 'You must agree to the Terms of Service to create an account.';
      return;
    }

    const bName = this.businessName.trim() || `${this.name.trim()}'s Handiwork Studio`;

    this.isLoading = true;

    setTimeout(() => {
      const res = this.userService.signup({
        name: this.name.trim(),
        email: this.email.trim(),
        role: this.role,
        phone: this.phone.trim(),
        businessName: bName
      });

      if (this.role === 'business_owner') {
        this.worksService.updateBusinessProfile(bName, {
          name: bName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          category: this.category,
          location: 'San Francisco, CA',
          bio: `Specialized studio for ${this.category.toLowerCase()} handiworks, bespoke creations, and artisan designs.`,
          email: this.email,
          phone: this.phone || '+1 (555) 019-2831',
          businessHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
          establishedYear: '2025'
        });

        this.successMessage = `🎉 Business Account created for ${bName}! Redirecting to Business Dashboard...`;
        setTimeout(() => {
          this.router.navigate(['/business-dashboard', encodeURIComponent(bName)]);
        }, 1200);
      } else {
        this.successMessage = `🎉 Account created successfully! Redirecting to your Consumer Profile...`;
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1200);
      }
    }, 500);
  }
}
