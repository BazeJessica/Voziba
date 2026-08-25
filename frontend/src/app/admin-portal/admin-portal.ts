import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { WorksService } from '../services/works.service';
import { UserService } from '../services/user.service';
import { bookingType, workType, businessProfileType, testimonyType } from '../models/types';

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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
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

  // Passcode Security Protection (Code: 12345)
  isAdminAuthorized = signal<boolean>(this.checkSavedAdminAccess());
  passcodeInput = signal<string>('');
  passcodeError = signal<string>('');

  private checkSavedAdminAccess(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('voziba_admin_authorized') === 'true';
    }
    return false;
  }

  unlockAdminPortal() {
    const code = this.passcodeInput().trim();
    if (code === '12345') {
      this.isAdminAuthorized.set(true);
      this.passcodeError.set('');
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('voziba_admin_authorized', 'true');
      }
      this.showToast('Admin Control Center Unlocked!');
    } else {
      this.passcodeError.set('Access Denied: Invalid Admin Passcode PIN (use 12345).');
    }
  }

  lockAdminPortal() {
    this.isAdminAuthorized.set(false);
    this.passcodeInput.set('');
    this.passcodeError.set('');
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('voziba_admin_authorized');
    }
  }

  constructor() {
    if (this.userService.isLoggedIn()) {
      if (this.userService.userRole() === 'consumer') {
        alert('Access Restricted: Consumer accounts cannot access the Platform Admin Control Center.');
        this.router.navigate(['/profile']);
        return;
      }
      if (this.userService.userRole() === 'business_owner') {
        alert('Access Restricted: Business Owner accounts cannot access the Platform Admin Control Center.');
        this.router.navigate(['/business-dashboard']);
        return;
      }
    }

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
      this.lockAdminPortal();
      this.userService.logout();
      this.router.navigate(['/']);
    }
  }

  activeTab = signal<'users' | 'businesses' | 'privileges' | 'works' | 'bookings' | 'team' | 'testimonies'>('users');
  searchQuery = signal<string>('');
  toastMessage = signal<string>('');

  // Testimony Management State
  showTestimonyModal = signal<boolean>(false);
  editingTestimonyId = signal<number | null>(null);
  testimonyForm = signal<Omit<testimonyType, 'id'>>({
    customerName: '',
    customerRole: 'Verified Customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    workTitle: '',
    creatorName: '',
    comment: '',
    rating: 5
  });

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

  // Team Management State
  teamList = signal<TeamMember[]>(this.loadInitialTeam());
  showTeamModal = signal<boolean>(false);
  editingTeamMember: TeamMember | null = null;
  teamForm: Partial<TeamMember> = {
    name: '',
    role: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    status: 'Active'
  };

  private loadInitialTeam(): TeamMember[] {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('voziba_admin_team');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved admin team', e);
        }
      }
    }
    return [
      {
        id: 'TM-001',
        name: 'Amara Asante',
        role: 'Founder & CEO',
        email: 'amara.a@voziba.com',
        phone: '+233 24 123 4567',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        bio: 'Visionary behind Voziba, passionate about connecting local artisans with the world.',
        status: 'Active',
        joinedDate: '2023-01-10'
      },
      {
        id: 'TM-002',
        name: 'Kwame Boateng',
        role: 'Head of Artisan Relations',
        email: 'kwame.b@voziba.com',
        phone: '+233 20 987 6543',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        bio: 'Dedicated to supporting craftspeople in growing their businesses and showcasing their work.',
        status: 'Active',
        joinedDate: '2023-03-15'
      },
      {
        id: 'TM-003',
        name: 'Nana Ama Ofori',
        role: 'Lead Product Designer',
        email: 'nana.o@voziba.com',
        phone: '+233 27 555 0192',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        bio: 'Crafting seamless experiences that make discovering and booking handiworks effortless.',
        status: 'Active',
        joinedDate: '2023-06-01'
      }
    ];
  }

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
  totalTeamCount = computed(() => this.teamList().length);
  totalTestimoniesCount = computed(() => this.worksService.testimonies().length);
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

  // Filtered Team Members
  filteredTeam = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.teamList();
    return this.teamList().filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.role.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query) ||
      t.phone.includes(query)
    );
  });

  // Filtered Testimonies
  filteredTestimonies = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.worksService.testimonies();
    if (!query) return list;
    return list.filter(t =>
      t.customerName.toLowerCase().includes(query) ||
      t.customerRole.toLowerCase().includes(query) ||
      t.creatorName.toLowerCase().includes(query) ||
      t.workTitle.toLowerCase().includes(query) ||
      t.comment.toLowerCase().includes(query)
    );
  });

  // Set active tab
  setTab(tab: 'users' | 'businesses' | 'privileges' | 'works' | 'bookings' | 'team' | 'testimonies') {
    this.activeTab.set(tab);
  }

  // Team Member Actions
  openAddTeamModal() {
    this.editingTeamMember = null;
    this.teamForm = {
      name: '',
      role: '',
      email: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: '',
      status: 'Active'
    };
    this.showTeamModal.set(true);
  }

  openEditTeamModal(member: TeamMember) {
    this.editingTeamMember = member;
    this.teamForm = { ...member };
    this.showTeamModal.set(true);
  }

  closeTeamModal() {
    this.showTeamModal.set(false);
    this.editingTeamMember = null;
  }

  saveTeamMember() {
    if (!this.teamForm.name || !this.teamForm.role || !this.teamForm.email) {
      alert('Please fill in Name, Role, and Email.');
      return;
    }

    if (this.editingTeamMember) {
      const updated: TeamMember = {
        ...this.editingTeamMember,
        name: this.teamForm.name || this.editingTeamMember.name,
        role: this.teamForm.role || this.editingTeamMember.role,
        email: this.teamForm.email || this.editingTeamMember.email,
        phone: this.teamForm.phone || '',
        avatar: this.teamForm.avatar || this.editingTeamMember.avatar,
        bio: this.teamForm.bio || '',
        status: (this.teamForm.status as TeamMember['status']) || 'Active'
      };

      this.teamList.update(list => {
        const newList = list.map(m => m.id === updated.id ? updated : m);
        localStorage.setItem('voziba_admin_team', JSON.stringify(newList));
        return newList;
      });
      this.showToast(`Team member "${updated.name}" updated successfully.`);
    } else {
      const newMember: TeamMember = {
        id: `TM-${String(Date.now()).slice(-4)}`,
        name: this.teamForm.name,
        role: this.teamForm.role,
        email: this.teamForm.email,
        phone: this.teamForm.phone || '+233 20 000 0000',
        avatar: this.teamForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: this.teamForm.bio || 'Voziba team member dedicated to empowering artisans and consumers.',
        status: (this.teamForm.status as TeamMember['status']) || 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      this.teamList.update(list => {
        const newList = [...list, newMember];
        localStorage.setItem('voziba_admin_team', JSON.stringify(newList));
        return newList;
      });
      this.showToast(`New team member "${newMember.name}" added successfully.`);
    }

    this.closeTeamModal();
  }

  deleteTeamMember(member: TeamMember) {
    if (confirm(`Are you sure you want to remove team member "${member.name}"?`)) {
      this.teamList.update(list => {
        const newList = list.filter(m => m.id !== member.id);
        localStorage.setItem('voziba_admin_team', JSON.stringify(newList));
        return newList;
      });
      this.showToast(`Team member "${member.name}" removed.`);
    }
  }

  toggleTeamStatus(member: TeamMember) {
    const newStatus: TeamMember['status'] = member.status === 'Active' ? 'On Leave' : (member.status === 'On Leave' ? 'Inactive' : 'Active');
    this.teamList.update(list => {
      const newList = list.map(m => m.id === member.id ? { ...m, status: newStatus } : m);
      localStorage.setItem('voziba_admin_team', JSON.stringify(newList));
      return newList;
    });
    this.showToast(`Team member "${member.name}" status updated to ${newStatus}.`);
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

    // Automatically log out user if their active session account was suspended
    const activeProfile = this.userService.profile();
    if (newStatus === 'Suspended' && (activeProfile.email.toLowerCase() === user.email.toLowerCase() || activeProfile.id === user.id)) {
      this.userService.logout();
      this.showToast(`User ${user.name} account was suspended and automatically logged out of the app.`);
    } else {
      this.showToast(`User ${user.name} status updated to ${newStatus}.`);
    }
  }

  deleteUserAccount(user: AdminUser) {
    if (confirm(`Are you sure you want to permanently delete user account "${user.name}"?`)) {
      this.usersList.update(list => {
        const updated = list.filter(u => u.id !== user.id);
        localStorage.setItem('voziba_admin_users', JSON.stringify(updated));
        return updated;
      });

      // Async API call to Next.js MongoDB backend
      if (typeof fetch !== 'undefined') {
        fetch(`http://localhost:3001/api/users?email=${encodeURIComponent(user.email)}`, {
          method: 'DELETE'
        }).catch(err => console.warn('Next.js API offline, processed locally:', err.message));
      }

      // Check if deleted user is currently logged into active app session
      const activeProfile = this.userService.profile();
      const isActiveUserDeleted = (
        activeProfile.email.toLowerCase() === user.email.toLowerCase() ||
        activeProfile.id === user.id ||
        activeProfile.name.toLowerCase() === user.name.toLowerCase()
      );

      if (isActiveUserDeleted && this.userService.isLoggedIn()) {
        this.userService.logout();
        this.showToast(`User account "${user.name}" deleted permanently and active session logged out.`);
      } else {
        this.showToast(`User account "${user.name}" deleted successfully.`);
      }
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
      const bizProfile = currentProfiles[businessName];
      delete currentProfiles[businessName];
      this.worksService.businessProfiles.set(currentProfiles);
      localStorage.setItem('voziba_business_profiles', JSON.stringify(currentProfiles));

      // Remove all handiworks associated with this business studio
      const remainingWorks = this.worksService.works().filter(w => w.creatorName !== businessName);
      this.worksService.works.set(remainingWorks);
      localStorage.setItem('voziba_works', JSON.stringify(remainingWorks));

      // Async sync with Next.js backend
      if (typeof fetch !== 'undefined') {
        fetch(`http://localhost:3001/api/works?creatorName=${encodeURIComponent(businessName)}`, {
          method: 'DELETE'
        }).catch(err => console.warn('Next.js API offline, deleted locally:', err.message));
      }

      // Automatically log out active session if logged-in user belongs to this deleted business studio
      const activeProfile = this.userService.profile();
      const isOwnerLoggedIn = (
        activeProfile.role === 'business_owner' && (
          activeProfile.name.toLowerCase() === businessName.toLowerCase() ||
          (bizProfile && activeProfile.email.toLowerCase() === bizProfile.email.toLowerCase())
        )
      );

      if (isOwnerLoggedIn && this.userService.isLoggedIn()) {
        this.userService.logout();
        this.showToast(`Business studio "${businessName}" removed and active artisan logged out.`);
      } else {
        this.showToast(`Business studio "${businessName}" removed.`);
      }
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

  // Testimony Management Actions
  openAddTestimonyModal() {
    this.editingTestimonyId.set(null);
    this.testimonyForm.set({
      customerName: '',
      customerRole: 'Verified Customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      workTitle: '',
      creatorName: '',
      comment: '',
      rating: 5
    });
    this.showTestimonyModal.set(true);
  }

  openEditTestimonyModal(t: testimonyType) {
    this.editingTestimonyId.set(t.id);
    this.testimonyForm.set({
      customerName: t.customerName,
      customerRole: t.customerRole,
      avatar: t.avatar,
      workTitle: t.workTitle,
      creatorName: t.creatorName,
      comment: t.comment,
      rating: t.rating
    });
    this.showTestimonyModal.set(true);
  }

  closeTestimonyModal() {
    this.showTestimonyModal.set(false);
    this.editingTestimonyId.set(null);
  }

  updateTestimonyFormField(field: keyof Omit<testimonyType, 'id'>, value: any) {
    this.testimonyForm.update(form => ({ ...form, [field]: value }));
  }

  saveTestimonyFromAdmin() {
    const form = this.testimonyForm();
    if (!form.customerName.trim() || !form.comment.trim()) {
      alert('Please fill in the customer name and testimony comment.');
      return;
    }

    const editId = this.editingTestimonyId();
    if (editId !== null) {
      this.worksService.updateTestimony(editId, form);
      this.showToast(`Testimony by "${form.customerName}" updated.`);
    } else {
      this.worksService.addTestimony(form);
      this.showToast(`New testimony by "${form.customerName}" published!`);
    }

    this.closeTestimonyModal();
  }

  deleteTestimonyFromAdmin(t: testimonyType) {
    if (confirm(`Are you sure you want to delete the testimony by "${t.customerName}"?`)) {
      this.worksService.deleteTestimony(t.id);
      this.showToast(`Testimony by "${t.customerName}" deleted.`);
    }
  }

  // Toast
  private showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 4000);
  }
}
