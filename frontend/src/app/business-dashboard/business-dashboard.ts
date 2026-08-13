import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorksService } from '../services/works.service';
import { UserService } from '../services/user.service';
import { bookingType, workType, businessProfileType } from '../models/types';

export interface CustomerSummary {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastBookingDate: string;
  bookings: bookingType[];
}

export interface BusinessDetails extends businessProfileType {
  rating: number;
  reviewsCount: number;
  totalWorks: number;
}

@Component({
  selector: 'app-business-dashboard',
  standalone: false,
  templateUrl: './business-dashboard.html',
  styleUrl: './business-dashboard.scss'
})
export class BusinessDashboardComponent implements OnInit {
  worksService = inject(WorksService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  onLogout() {
    if (confirm('Are you sure you want to log out of your Voziba Business Portal?')) {
      this.userService.logout();
      this.router.navigate(['/']);
    }
  }

  // State Signals
  selectedCreator = signal<string>('Elias & Co. Woodworks');
  activeTab = signal<'active' | 'done' | 'customers' | 'profile' | 'all' | 'works'>('active');
  sortOrder = signal<'bookingDateAsc' | 'bookingDateDesc' | 'createdDesc'>('bookingDateAsc');
  searchQuery = signal<string>('');
  toastMessage = signal<string>('');
  sidebarCollapsed = signal<boolean>(false);

  // Selected work for modal details
  selectedWorkForDetails: workType | null = null;

  // Work context menu & edit panel state
  openWorkMenuId: number | string | null = null;
  editingWorkId: number | string | null = null;
  editWorkDraft: Partial<workType> = {};

  // Edit Business Profile Form State
  editProfileForm = signal<businessProfileType>({
    name: '',
    avatar: '',
    category: '',
    location: '',
    bio: '',
    email: '',
    phone: '',
    businessHours: '',
    establishedYear: ''
  });

  // Avatar Presets for Business Owners
  avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80'
  ];

  // Available Creators List
  availableCreators = computed(() => {
    const list = this.worksService.works().map(w => w.creatorName);
    return ['All Creators', ...Array.from(new Set(list))];
  });

  // Admin view check
  isGeneralAdminView = computed(() => this.selectedCreator() === 'All Creators');

  // Dynamic Profile Info for currently selected business
  activeBusinessDetails = computed<BusinessDetails>(() => {
    const creator = this.selectedCreator();
    const works = this.worksService.works();
    const profile = this.worksService.getBusinessProfile(creator);
    const sampleWork = works.find(w => w.creatorName === creator);

    const rating = sampleWork ? sampleWork.rating : 4.9;
    const reviewsCount = sampleWork ? sampleWork.reviewsCount : 34;
    const totalWorks = works.filter(w => w.creatorName === creator).length;

    // When viewing their own business, always prefer the user's real avatar
    // and name so the sidebar stays in sync with the nav/profile.
    const ownerProfile = this.userService.profile();
    const isOwnerView = creator.toLowerCase() === ownerProfile.name.toLowerCase()
      || creator === 'All Creators';

    const defaultAvatar = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80';
    const avatar = isOwnerView && ownerProfile.avatar && ownerProfile.avatar !== defaultAvatar
      ? ownerProfile.avatar
      : (profile.avatar && profile.avatar !== defaultAvatar ? profile.avatar : ownerProfile.avatar || profile.avatar);

    return {
      ...profile,
      name: isOwnerView ? (ownerProfile.name || profile.name) : profile.name,
      avatar,
      rating,
      reviewsCount,
      totalWorks
    };
  });

  // All Bookings reference
  allBookings = this.worksService.bookings;

  // Bookings filtered by Selected Creator
  creatorBookings = computed(() => {
    const creator = this.selectedCreator();
    const query = this.searchQuery().toLowerCase().trim();

    return this.allBookings().filter(b => {
      const matchesCreator = creator === 'All Creators' || b.creatorName === creator;
      const matchesQuery = !query ||
        b.id.toLowerCase().includes(query) ||
        b.workTitle.toLowerCase().includes(query) ||
        b.customerName.toLowerCase().includes(query) ||
        b.customerEmail.toLowerCase().includes(query) ||
        (b.customNotes && b.customNotes.toLowerCase().includes(query));

      return matchesCreator && matchesQuery;
    });
  });

  // Active Orders (Pending & Confirmed) sorted chronologically by time
  activeOrders = computed(() => {
    const active = this.creatorBookings().filter(b => b.status === 'pending' || b.status === 'confirmed');
    const order = this.sortOrder();

    return [...active].sort((a, b) => {
      if (order === 'bookingDateAsc') {
        return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      } else if (order === 'bookingDateDesc') {
        return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  });

  // Done Orders (Completed)
  doneOrders = computed(() => {
    return this.creatorBookings().filter(b => b.status === 'completed');
  });

  // Cancelled / Denied Orders
  cancelledOrders = computed(() => {
    return this.creatorBookings().filter(b => b.status === 'cancelled');
  });

  // Key Performance Indicators
  pendingCount = computed(() => {
    return this.creatorBookings().filter(b => b.status === 'pending').length;
  });

  activeCount = computed(() => {
    return this.activeOrders().length;
  });

  completedCount = computed(() => {
    return this.doneOrders().length;
  });

  totalRevenue = computed(() => {
    return this.creatorBookings()
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  });

  // Derived Customer Directory
  customersList = computed<CustomerSummary[]>(() => {
    const bookings = this.creatorBookings();
    const customerMap = new Map<string, CustomerSummary>();

    bookings.forEach(b => {
      const key = b.customerEmail.toLowerCase().trim();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          lastBookingDate: b.bookingDate,
          bookings: []
        });
      }

      const cust = customerMap.get(key)!;
      cust.totalOrders += 1;
      if (b.status === 'completed' || b.status === 'confirmed') {
        cust.totalSpent += b.totalPrice;
      }
      cust.bookings.push(b);

      if (new Date(b.bookingDate) > new Date(cust.lastBookingDate)) {
        cust.lastBookingDate = b.bookingDate;
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalOrders - a.totalOrders);
  });

  ngOnInit() {
    // Role protection: Ensure consumer users cannot access business owner dashboard
    if (this.userService.isLoggedIn() && this.userService.userRole() === 'consumer') {
      this.router.navigate(['/profile']);
      return;
    }
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const paramName = params.get('businessName');
      if (paramName) {
        const decoded = decodeURIComponent(paramName);
        const match = this.availableCreators().find(c => c.toLowerCase() === decoded.toLowerCase());
        if (match) {
          this.selectedCreator.set(match);
        } else {
          this.selectedCreator.set(decoded);
        }
      } else {
        // Default to the logged-in business owner's registered name
        const ownerName = this.userService.profile().name;
        this.selectedCreator.set(ownerName || 'All Creators');
      }
      // Populate profile form for current business
      this.initProfileForm();
    });
  }

  initProfileForm() {
    const currentName = this.selectedCreator();
    const profile = this.worksService.getBusinessProfile(currentName);
    this.editProfileForm.set({ ...profile });
  }

  // Tab & Filter Actions
  selectCreator(creatorName: string) {
    this.selectedCreator.set(creatorName);
    this.initProfileForm();
    if (creatorName === 'All Creators') {
      this.router.navigate(['/business-dashboard']);
    } else {
      this.router.navigate(['/business-dashboard', encodeURIComponent(creatorName)]);
    }
  }

  // Add Work Showcase Modal State
  readonly showAddWorkModal = signal<boolean>(false);

  openAddWorkModal() {
    this.showAddWorkModal.set(true);
  }

  closeAddWorkModal() {
    this.showAddWorkModal.set(false);
  }

  onWorkAdded() {
    this.showToast('New handiwork showcase photo published for consumers successfully!');
  }

  setTab(tab: 'active' | 'done' | 'customers' | 'profile' | 'all' | 'works') {
    this.activeTab.set(tab);
    if (tab === 'profile') {
      this.initProfileForm();
    }
    this.openWorkMenuId = null;
    this.editingWorkId = null;
  }

  // Published Works — always scoped to the logged-in business owner's name,
  // so it shows ALL their works regardless of URL / selectedCreator state.
  publishedWorks = computed(() => {
    const ownerName = this.userService.profile().name.trim();
    const allWorks = this.worksService.works();
    // Filter by owner name (case-insensitive) so newly published works appear instantly
    const owned = allWorks.filter(w => w.creatorName.toLowerCase() === ownerName.toLowerCase());
    // If the owner has no matched works yet (new account / name mismatch),
    // fall back to the currently selectedCreator so the section is never empty
    if (owned.length === 0 && this.selectedCreator() !== 'All Creators') {
      return allWorks.filter(w => w.creatorName === this.selectedCreator());
    }
    return owned;
  });

  // Work context menu
  toggleWorkMenu(id: number | string, event: Event) {
    event.stopPropagation();
    this.openWorkMenuId = this.openWorkMenuId === id ? null : id;
    this.editingWorkId = null;
  }

  closeAllWorkMenus() {
    this.openWorkMenuId = null;
  }

  // Start inline editing a work
  startEditWork(work: workType, event: Event) {
    event.stopPropagation();
    this.editingWorkId = work.id;
    this.editWorkDraft = { title: work.title, description: work.description, price: work.price, tags: [...work.tags] };
    this.openWorkMenuId = null;
  }

  cancelEditWork() {
    this.editingWorkId = null;
    this.editWorkDraft = {};
  }

  saveEditWork(workId: number | string) {
    this.worksService.updateWork(workId, this.editWorkDraft);
    this.editingWorkId = null;
    this.editWorkDraft = {};
    this.showToast('Work updated successfully!');
  }

  deletePublishedWork(work: workType, event: Event) {
    event.stopPropagation();
    if (confirm(`Delete "${work.title}" from your published works? This cannot be undone.`)) {
      this.worksService.deleteWork(work.id);
      this.openWorkMenuId = null;
      this.showToast(`"${work.title}" has been removed.`);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  setSortOrder(order: 'bookingDateAsc' | 'bookingDateDesc' | 'createdDesc') {
    this.sortOrder.set(order);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  saveBusinessProfile() {
    const form = this.editProfileForm();
    if (!form.name.trim()) {
      alert('Please enter a valid Business Name.');
      return;
    }

    const oldName = this.selectedCreator();
    this.worksService.updateBusinessProfile(oldName, form);
    this.selectedCreator.set(form.name);
    this.showToast(`Business profile for "${form.name}" updated successfully!`);

    this.router.navigate(['/business-dashboard', encodeURIComponent(form.name)]);
  }

  selectAvatarPreset(url: string) {
    this.editProfileForm.update(f => ({ ...f, avatar: url }));
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        if (base64Url) {
          this.editProfileForm.update(f => ({ ...f, avatar: base64Url }));
          
          // Also persist photo update immediately for current business
          const currentName = this.selectedCreator();
          const currentProfile = this.worksService.getBusinessProfile(currentName);
          const updatedProfile = { ...currentProfile, avatar: base64Url };
          this.worksService.updateBusinessProfile(currentName, updatedProfile);
          this.showToast('Business photo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Business Owner Workflow Actions
  confirmOrder(booking: bookingType) {
    this.worksService.updateBookingStatus(booking.id, 'confirmed');
    this.showToast(`Order #${booking.id} confirmed! Status set to In Production.`);
  }

  denyOrder(booking: bookingType) {
    if (confirm(`Are you sure you want to decline/deny order #${booking.id} for "${booking.customerName}"?`)) {
      this.worksService.updateBookingStatus(booking.id, 'cancelled');
      this.showToast(`Order #${booking.id} declined.`);
    }
  }

  markAsDone(booking: bookingType) {
    this.worksService.updateBookingStatus(booking.id, 'completed');
    this.showToast(`Order #${booking.id} marked as Done & Completed! 🎉`);
  }

  reopenOrder(booking: bookingType) {
    this.worksService.updateBookingStatus(booking.id, 'confirmed');
    this.showToast(`Order #${booking.id} moved back to Active Orders.`);
  }

  viewHandiwork(workId: number | string) {
    const work = this.worksService.getWorkById(workId);
    if (work) {
      this.selectedWorkForDetails = work;
    } else {
      alert('Handiwork details not found.');
    }
  }

  closeWorkDetailsModal() {
    this.selectedWorkForDetails = null;
  }

  private showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set('');
    }, 4000);
  }
}
