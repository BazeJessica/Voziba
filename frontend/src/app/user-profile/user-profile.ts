import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { UserService, AVATAR_PRESETS } from '../services/user.service';
import { WorksService } from '../services/works.service';
import { bookingType, workType, userProfileType } from '../models/types';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfileComponent {
  userService = inject(UserService);
  worksService = inject(WorksService);
  router = inject(Router);

  onLogout() {
    if (confirm('Are you sure you want to log out of your Voziba consumer profile?')) {
      this.userService.logout();
      this.router.navigate(['/']);
    }
  }

  activeTab: 'details' | 'bookings' = 'bookings';
  bookingStatusFilter = signal<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  bookingSearchQuery = signal<string>('');

  isEditing = false;
  showAvatarPicker = false;
  saveSuccessMessage = '';
  avatarPresets = AVATAR_PRESETS;

  // Dropdown menu state for booking cards
  openBookingMenuId: string | null = null;

  toggleBookingMenu(id: string) {
    if (this.openBookingMenuId === id) {
      this.openBookingMenuId = null;
    } else {
      this.openBookingMenuId = id;
    }
  }

  closeBookingMenu() {
    this.openBookingMenuId = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeBookingMenu();
  }

  // Selected work for modal popup if consumer clicks "View Work" on a booking
  selectedWorkForDetails: workType | null = null;
  selectedWorkToBookAgain: workType | null = null;

  // Form Model for Profile Editing
  editForm: userProfileType = { ...this.userService.profile() };

  // Profile signal reference
  user = this.userService.profile;

  // Categories signal from WorksService
  allCategories = this.worksService.categories;

  // Bookings list signal
  bookings = this.worksService.bookings;

  // Statistics Computations
  totalBookingsCount = computed(() => this.bookings().length);
  
  pendingCount = computed(() => 
    this.bookings().filter(b => b.status === 'pending').length
  );
  
  confirmedCount = computed(() => 
    this.bookings().filter(b => b.status === 'confirmed').length
  );

  completedCount = computed(() => 
    this.bookings().filter(b => b.status === 'completed').length
  );

  totalSpent = computed(() => {
    return this.bookings()
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  });

  // Filtered Bookings Computation
  filteredBookings = computed(() => {
    const filter = this.bookingStatusFilter();
    const query = this.bookingSearchQuery().toLowerCase().trim();

    return this.bookings().filter(booking => {
      const matchesStatus = filter === 'all' || booking.status === filter;
      const matchesQuery = !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.workTitle.toLowerCase().includes(query) ||
        booking.creatorName.toLowerCase().includes(query) ||
        (booking.customNotes && booking.customNotes.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  });

  switchTab(tab: 'details' | 'bookings') {
    this.activeTab = tab;
  }

  setBookingFilter(filter: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled') {
    this.bookingStatusFilter.set(filter);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.bookingSearchQuery.set(val);
  }

  clearSearch() {
    this.bookingSearchQuery.set('');
  }

  startEditing() {
    this.editForm = { ...this.userService.profile() };
    this.isEditing = true;
    this.saveSuccessMessage = '';
  }

  cancelEditing() {
    this.isEditing = false;
    this.showAvatarPicker = false;
  }

  toggleCategoryPreference(categoryName: string) {
    const current = this.editForm.preferredCategories || [];
    if (current.includes(categoryName)) {
      this.editForm.preferredCategories = current.filter(c => c !== categoryName);
    } else {
      this.editForm.preferredCategories = [...current, categoryName];
    }
  }

  isCategoryPreferred(categoryName: string): boolean {
    return (this.editForm.preferredCategories || []).includes(categoryName);
  }

  selectAvatarPreset(avatarUrl: string) {
    this.editForm.avatar = avatarUrl;
    this.showAvatarPicker = false;
    this.userService.updateProfile({ avatar: avatarUrl });
  }

  onAvatarClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WEBP, etc.).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataUrl = e.target.result as string;
        this.editForm.avatar = dataUrl;
        this.userService.updateProfile({ avatar: dataUrl });
        this.saveSuccessMessage = 'Profile picture updated successfully!';
        setTimeout(() => {
          this.saveSuccessMessage = '';
        }, 4000);
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (!this.editForm.name.trim() || !this.editForm.email.trim()) {
      alert('Name and Email are required.');
      return;
    }

    this.userService.updateProfile(this.editForm);
    this.isEditing = false;
    this.saveSuccessMessage = 'Profile updated successfully!';
    
    setTimeout(() => {
      this.saveSuccessMessage = '';
    }, 4000);
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking request?')) {
      this.worksService.cancelBooking(bookingId);
    }
  }

  viewWork(workId: number | string) {
    const work = this.worksService.getWorkById(workId);
    if (work) {
      this.selectedWorkForDetails = work;
    } else {
      alert('Handiwork details no longer available.');
    }
  }

  closeWorkDetailsModal() {
    this.selectedWorkForDetails = null;
  }

  reBookWork(work: workType) {
    this.selectedWorkForDetails = null;
    this.selectedWorkToBookAgain = work;
  }

  closeRebookModal() {
    this.selectedWorkToBookAgain = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmed & In Progress';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending Maker Approval';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }
}
