import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { WorksService } from '../services/works.service';
import { UserService } from '../services/user.service';
import { bookingType, workType, businessProfileType } from '../models/types';

export interface UserPrivileges {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApproveOrders: boolean;
  canManageRoles: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Consumer' | 'Business Owner' | 'Super Admin' | 'Moderator';
  status: 'Active' | 'Suspended' | 'Pending Verification';
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  privileges: UserPrivileges;
}

export interface RoleMatrix {
  roleName: string;
  description: string;
  privileges: UserPrivileges;
}

@Component({
  selector: 'app-admin-portal',
  standalone: false,
  templateUrl: './admin-portal.html',
  styleUrl: './admin-portal.scss'
})
export class AdminPortalComponent {
  worksService = inject(WorksService);
  userService = inject(UserService);
  router = inject(Router);

  constructor() {
    // Keep active user profile synced with the Admin portal users list
    const current = this.userService.profile();
    this.usersList.update(list => list.map(u => {
      if (u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase()) {
        return {
          ...u,
          name: current.name,
          email: current.email,
          phone: current.phone
        };
      }
      return u;
    }));
  }

  onLogout() {
    if (confirm('Are you sure you want to log out of the Admin Control Center?')) {
      this.userService.logout();
      this.router.navigate(['/']);
    }
  }

  activeTab = signal<'users' | 'businesses' | 'works' | 'bookings' | 'privileges'>('users');
  searchQuery = signal<string>('');
  toastMessage = signal<string>('');

  // Selected User for detail / privilege modal
  selectedUser: AdminUser | null = null;
  userBookingsModal: bookingType[] = [];

  // Privileges Editing Modal State
  editingPrivilegesUser: AdminUser | null = null;
  tempPrivileges: UserPrivileges = {
    canView: true,
    canEdit: false,
    canDelete: false,
    canApproveOrders: false,
    canManageRoles: false
  };

  // Edit Business Modal in Admin
  editingBusiness: businessProfileType | null = null;

  // Global Role Matrix
  roleMatrixList = signal<RoleMatrix[]>([
    {
      roleName: 'Super Admin',
      description: 'Full unmitigated platform control over users, businesses, orders, and privileges.',
      privileges: { canView: true, canEdit: true, canDelete: true, canApproveOrders: true, canManageRoles: true }
    },
    {
      roleName: 'Business Owner',
      description: 'Artisan studio owner privileges for managing handiwork listings, accepting orders, and editing studio profile.',
      privileges: { canView: true, canEdit: true, canDelete: true, canApproveOrders: true, canManageRoles: false }
    },
    {
      roleName: 'Platform Moderator',
      description: 'Staff member privileges to inspect listings, review customer reports, and flag violations.',
      privileges: { canView: true, canEdit: true, canDelete: false, canApproveOrders: false, canManageRoles: false }
    },
    {
      roleName: 'Consumer',
      description: 'Standard buyer account allowed to browse handiworks, place orders, write reviews, and edit personal details.',
      privileges: { canView: true, canEdit: true, canDelete: false, canApproveOrders: false, canManageRoles: false }
    }
  ]);

  // Registered Users list with granular privileges
  usersList = signal<AdminUser[]>(this.loadInitialUsers());

  private loadInitialUsers(): AdminUser[] {
    const saved = localStorage.getItem('voziba_admin_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved admin users', e);
      }
    }
    return [
      {
        id: 'USR-101',
        name: 'Jessica Miller',
        email: 'jessica.m@example.com',
        phone: '+1 (555) 234-5678',
        role: 'Super Admin',
        status: 'Active',
        joinedDate: '2024-01-15',
        totalOrders: 3,
        totalSpent: 1250,
        privileges: { canView: true, canEdit: true, canDelete: true, canApproveOrders: true, canManageRoles: true }
      },
      {
        id: 'USR-102',
        name: 'Marcus Vance',
        email: 'marcus.v@example.com',
        phone: '+1 (555) 891-2345',
        role: 'Consumer',
        status: 'Active',
        joinedDate: '2024-03-10',
        totalOrders: 2,
        totalSpent: 1400,
        privileges: { canView: true, canEdit: true, canDelete: false, canApproveOrders: false, canManageRoles: false }
      },
      {
        id: 'USR-103',
        name: 'Elena Rostova',
        email: 'elena.r@example.com',
        phone: '+1 (555) 432-8765',
        role: 'Moderator',
        status: 'Active',
        joinedDate: '2024-05-22',
        totalOrders: 1,
        totalSpent: 350,
        privileges: { canView: true, canEdit: true, canDelete: false, canApproveOrders: false, canManageRoles: false }
      },
      {
        id: 'USR-104',
        name: 'David Chen',
        email: 'david.chen@example.com',
        phone: '+1 (555) 765-4321',
        role: 'Consumer',
        status: 'Active',
        joinedDate: '2024-06-05',
        totalOrders: 4,
        totalSpent: 2100,
        privileges: { canView: true, canEdit: false, canDelete: false, canApproveOrders: false, canManageRoles: false }
      },
      {
        id: 'USR-105',
        name: 'Sophia Martinez',
        email: 'sophia.m@example.com',
        phone: '+1 (555) 987-6543',
        role: 'Consumer',
        status: 'Active',
        joinedDate: '2024-07-01',
        totalOrders: 1,
        totalSpent: 480,
        privileges: { canView: true, canEdit: true, canDelete: false, canApproveOrders: false, canManageRoles: false }
      }
    ];
  }

  // All Business Profiles from WorksService
  businessProfilesList = computed(() => {
    const profilesDict = this.worksService.businessProfiles();
    const works = this.worksService.works();
    const bookings = this.worksService.bookings();

    return Object.values(profilesDict).map(profile => {
      const studioWorks = works.filter(w => w.creatorName === profile.name);
      const studioBookings = bookings.filter(b => b.creatorName === profile.name);
      const revenue = studioBookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      return {
        ...profile,
        totalWorks: studioWorks.length,
        totalOrders: studioBookings.length,
        totalRevenue: revenue,
        isVerified: true
      };
    });
  });

  // KPI Metrics
  totalUsersCount = computed(() => this.usersList().length);
  totalBusinessesCount = computed(() => this.businessProfilesList().length);
  totalWorksCount = computed(() => this.worksService.works().length);
  totalPlatformVolume = computed(() => {
    return this.worksService.bookings()
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  });

  // Filtered Users
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.usersList();
    return this.usersList().filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.phone.includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  // Filtered Businesses
  filteredBusinesses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.businessProfilesList();
    return this.businessProfilesList().filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      b.location.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query)
    );
  });

  // Set active tab
  setTab(tab: 'users' | 'businesses' | 'works' | 'bookings' | 'privileges') {
    this.activeTab.set(tab);
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  // Admin User Actions
  toggleUserStatus(user: AdminUser) {
    const newStatus: AdminUser['status'] = user.status === 'Active' ? 'Suspended' : 'Active';
    this.usersList.update(list => {
      const updated: AdminUser[] = list.map(u => u.id === user.id ? { ...u, status: newStatus } : u);
      localStorage.setItem('voziba_admin_users', JSON.stringify(updated));
      return updated;
    });
    this.showToast(`User ${user.name} status updated to ${newStatus}.`);
  }

  deleteUserAccount(user: AdminUser) {
    if (confirm(`Are you sure you want to permanently delete user account "${user.name}"?`)) {
      this.usersList.update(list => {
        const updated = list.filter(u => u.id !== user.id);
        localStorage.setItem('voziba_admin_users', JSON.stringify(updated));
        return updated;
      });
      this.showToast(`User account "${user.name}" deleted successfully.`);
    }
  }

  viewUserBookings(user: AdminUser) {
    this.selectedUser = user;
    this.userBookingsModal = this.worksService.bookings().filter(b =>
      b.customerEmail.toLowerCase() === user.email.toLowerCase()
    );
  }

  closeUserModal() {
    this.selectedUser = null;
    this.userBookingsModal = [];
  }

  // Privileges Management Modal
  openPrivilegesModal(user: AdminUser) {
    this.editingPrivilegesUser = { ...user };
    this.tempPrivileges = { ...user.privileges };
  }

  closePrivilegesModal() {
    this.editingPrivilegesUser = null;
  }

  saveUserPrivileges() {
    if (!this.editingPrivilegesUser) return;
    const updatedUser = {
      ...this.editingPrivilegesUser,
      privileges: { ...this.tempPrivileges }
    };

    this.usersList.update(list => {
      const updated = list.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem('voziba_admin_users', JSON.stringify(updated));
      return updated;
    });

    // Automatically sync active user profile if the modified user is currently logged in
    const activeProfile = this.userService.profile();
    if (activeProfile.email.toLowerCase() === updatedUser.email.toLowerCase() || activeProfile.id === updatedUser.id) {
      this.userService.updateProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone
      });
    }

    this.showToast(`Updated role [${updatedUser.role}] and privileges for ${updatedUser.name}!`);
    this.editingPrivilegesUser = null;
  }

  // Global Role Matrix Toggle
  toggleMatrixPrivilege(role: RoleMatrix, key: keyof UserPrivileges) {
    role.privileges[key] = !role.privileges[key];
    this.showToast(`Updated global privilege [${key}] for role ${role.roleName}.`);
  }

  // Admin Business Actions
  openEditBusiness(business: businessProfileType) {
    this.editingBusiness = { ...business };
  }

  closeEditBusiness() {
    this.editingBusiness = null;
  }

  saveBusinessFromAdmin() {
    if (!this.editingBusiness) return;
    this.worksService.updateBusinessProfile(this.editingBusiness.name, this.editingBusiness);
    this.showToast(`Business profile for "${this.editingBusiness.name}" updated successfully by Admin!`);
    this.editingBusiness = null;
  }

  deleteBusinessOwner(businessName: string) {
    if (confirm(`Are you sure you want to remove business studio "${businessName}" from the platform?`)) {
      const currentProfiles = { ...this.worksService.businessProfiles() };
      delete currentProfiles[businessName];
      this.worksService.businessProfiles.set(currentProfiles);
      localStorage.setItem('voziba_business_profiles', JSON.stringify(currentProfiles));
      this.showToast(`Business studio "${businessName}" removed.`);
    }
  }

  deleteWorkFromAdmin(work: workType) {
    if (confirm(`Are you sure you want to delete listing "${work.title}"?`)) {
      const updatedWorks = this.worksService.works().filter(w => w.id !== work.id);
      this.worksService.works.set(updatedWorks);
      localStorage.setItem('voziba_works', JSON.stringify(updatedWorks));
      this.showToast(`Listing "${work.title}" deleted.`);
    }
  }

  jumpToBusinessPortal(businessName: string) {
    this.router.navigate(['/business-dashboard', encodeURIComponent(businessName)]);
  }

  // Toast
  private showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 4000);
  }
}
