import { Injectable, signal } from '@angular/core';
import { userProfileType } from '../models/types';

const DEFAULT_PROFILE: userProfileType = {
  id: 'USR-7829',
  name: 'Jessica Miller',
  email: 'jessica.m@example.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace',
  city: 'San Francisco, CA',
  country: 'United States',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  bio: 'Passionate about handcrafted walnut furniture, artisanal ceramics, and supporting independent master craftspeople.',
  joinedDate: 'January 2025',
  preferredCategories: ['Woodworking & Furniture', 'Pottery & Ceramics', 'Bespoke Tailoring']
};

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
];

export interface SignupParams {
  name: string;
  email: string;
  role: 'consumer' | 'business_owner';
  phone?: string;
  businessName?: string;
  bio?: string;
}

export interface LoginParams {
  email: string;
  role: 'consumer' | 'business_owner';
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/api';

  readonly profile = signal<userProfileType>(this.loadProfile());
  readonly isLoggedIn = signal<boolean>(this.loadLoginState());
  readonly userRole = signal<'consumer' | 'business_owner'>(this.loadUserRole());

  private loadLoginState(): boolean {
    const saved = localStorage.getItem('voziba_is_logged_in');
    return saved !== null ? JSON.parse(saved) : false;
  }

  private loadUserRole(): 'consumer' | 'business_owner' {
    const savedRole = localStorage.getItem('voziba_user_role');
    if (savedRole === 'consumer' || savedRole === 'business_owner') {
      return savedRole;
    }
    const currentProfile = this.loadProfile();
    return currentProfile.role || 'consumer';
  }

  private loadProfile(): userProfileType {
    const saved = localStorage.getItem('voziba_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user profile', e);
      }
    }
    return DEFAULT_PROFILE;
  }

  private getUsersRepo(): Record<string, userProfileType> {
    const saved = localStorage.getItem('voziba_users_repo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse voziba_users_repo', e);
      }
    }
    return {};
  }

  private saveUserToRepo(user: userProfileType) {
    if (!user.email) return;
    const repo = this.getUsersRepo();
    repo[user.email.toLowerCase().trim()] = user;
    localStorage.setItem('voziba_users_repo', JSON.stringify(repo));
  }

  updateProfile(updatedFields: Partial<userProfileType>): userProfileType {
    const updated = {
      ...this.profile(),
      ...updatedFields
    };
    if (updatedFields.role) {
      this.userRole.set(updatedFields.role);
      localStorage.setItem('voziba_user_role', updatedFields.role);
    }
    this.profile.set(updated);
    this.saveUserToRepo(updated);
    localStorage.setItem('voziba_user_profile', JSON.stringify(updated));
    return updated;
  }

  signup(params: SignupParams): { success: boolean; targetRoute: string } {
    const emailLower = params.email.toLowerCase().trim();
    const updatedProfile: userProfileType = {
      ...this.profile(),
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: params.name,
      email: emailLower,
      phone: params.phone || this.profile().phone || '',
      role: params.role,
      bio: params.bio || (params.role === 'business_owner' ? `Master Artisan & Owner of ${params.businessName || 'Handcraft Studio'}` : 'Handicrafts collector and custom orders buyer.'),
      joinedDate: 'Just now'
    };

    this.saveUserToRepo(updatedProfile);
    this.profile.set(updatedProfile);
    this.userRole.set(params.role);
    this.isLoggedIn.set(true);

    localStorage.setItem('voziba_user_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('voziba_user_role', params.role);
    localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));

    // Async sync with Next.js Backend API
    if (typeof fetch !== 'undefined') {
      fetch(`${this.apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, email: emailLower })
      }).catch(err => console.warn('Next.js API offline, continuing with local state:', err.message));
    }

    const targetRoute = params.role === 'consumer' ? '/profile' : '/business-dashboard';
    return { success: true, targetRoute };
  }

  loginWithRole(params: LoginParams): { success: boolean; targetRoute: string; detectedRole: 'consumer' | 'business_owner' } {
    const emailLower = params.email.toLowerCase().trim();
    const repo = this.getUsersRepo();

    let userProfile: userProfileType;

    if (repo[emailLower]) {
      // Load user profile peculiar to this registered email
      userProfile = repo[emailLower];
    } else {
      let detectedRole: 'consumer' | 'business_owner' = params.role || 'consumer';
      let userName = params.name || emailLower.split('@')[0];

      // Check admin users store
      const adminUsersRaw = localStorage.getItem('voziba_admin_users');
      if (adminUsersRaw) {
        try {
          const adminUsers = JSON.parse(adminUsersRaw);
          const match = adminUsers.find((u: any) => u.email.toLowerCase() === emailLower);
          if (match && match.role) {
            detectedRole = match.role === 'business_owner' ? 'business_owner' : 'consumer';
            userName = match.name || userName;
          }
        } catch (e) {
          console.error('Error reading admin users store:', e);
        }
      }

      userProfile = {
        ...DEFAULT_PROFILE,
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        email: emailLower,
        name: userName,
        role: detectedRole
      };
      this.saveUserToRepo(userProfile);
    }

    const detectedRole = userProfile.role || 'consumer';

    this.profile.set(userProfile);
    this.userRole.set(detectedRole);
    this.isLoggedIn.set(true);

    localStorage.setItem('voziba_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('voziba_user_role', detectedRole);
    localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));

    // Async sync with Next.js Backend API
    if (typeof fetch !== 'undefined') {
      fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower, role: detectedRole })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          const apiRole = data.user.role || detectedRole;
          const apiProfile: userProfileType = {
            ...userProfile,
            id: data.user.id || userProfile.id,
            name: data.user.name || userProfile.name,
            email: data.user.email || userProfile.email,
            role: apiRole,
            bio: data.user.bio || userProfile.bio
          };
          this.profile.set(apiProfile);
          this.userRole.set(apiRole);
          this.saveUserToRepo(apiProfile);
          localStorage.setItem('voziba_user_profile', JSON.stringify(apiProfile));
          localStorage.setItem('voziba_user_role', apiRole);
        }
      })
      .catch(err => console.warn('Next.js API offline, continuing with local state:', err.message));
    }

    const targetRoute = detectedRole === 'consumer' ? '/profile' : '/business-dashboard';
    return { success: true, targetRoute, detectedRole };
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.setItem('voziba_is_logged_in', JSON.stringify(false));
  }

  login() {
    this.isLoggedIn.set(true);
    localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));
  }

  resetProfile(): userProfileType {
    this.profile.set(DEFAULT_PROFILE);
    this.userRole.set('consumer');
    localStorage.setItem('voziba_user_profile', JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem('voziba_user_role', 'consumer');
    return DEFAULT_PROFILE;
  }
}
