import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { userProfileType } from '../models/types';

const DEFAULT_PROFILE: userProfileType = {
  id: 'USR-7829',
  name: 'Jessica Miller',
  email: 'jessica.m@example.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace',
  city: 'San Francisco, CA',
  country: 'United States',
  avatar: '',
  bio: 'Passionate about handcrafted walnut furniture, artisanal ceramics, and supporting independent master craftspeople.',
  joinedDate: 'January 2025',
  preferredCategories: ['Woodworking & Furniture', 'Pottery & Ceramics', 'Bespoke Tailoring']
};

export interface SignupParams {
  name: string;
  email: string;
  password: string;
  role: 'consumer' | 'business_owner';
  phone?: string;
  businessName?: string;
  bio?: string;
}

export interface LoginParams {
  email: string;
  password: string;
  role: 'consumer' | 'business_owner';
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/api';
  private http = inject(HttpClient);
  readonly profile = signal<userProfileType>(this.loadProfile());
  readonly isLoggedIn = signal<boolean>(this.loadLoginState());
  readonly userRole = signal<'consumer' | 'business_owner'>(this.loadUserRole());

  private loadLoginState(): boolean {
    const saved = localStorage.getItem('voziba_is_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
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
        const parsed = JSON.parse(saved);
        if (parsed.avatar === 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250') {
          parsed.avatar = '';
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved user profile', e);
      }
    }
    return DEFAULT_PROFILE;
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
    localStorage.setItem('voziba_user_profile', JSON.stringify(updated));
    return updated;
  }

  signup(params: SignupParams): Observable<{ success: boolean; targetRoute: string; user?: any }> {
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, params).pipe(
      map((res) => {
        if (res.accessToken || res.token) {
          this.saveTokens(res.accessToken || res.token, res.refreshToken);
        }
        const updatedProfile = {
          ...this.profile(),
          id: res.user?.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: res.user?.name || params.name,
          email: res.user?.email || params.email,
          phone: res.user?.phone || params.phone || this.profile().phone || '',
          role: res.user?.role || params.role,
          bio: res.user?.bio || params.bio || (params.role === 'business_owner' ? `Master Artisan & Owner of ${params.businessName || 'Handcraft Studio'}` : this.profile().bio),
          joinedDate: 'Just now'
        };
        this.profile.set(updatedProfile as any);
        this.userRole.set(params.role);
        this.isLoggedIn.set(true);
        localStorage.setItem('voziba_user_profile', JSON.stringify(updatedProfile));
        localStorage.setItem('voziba_user_role', params.role);
        localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));

        const targetRoute = res.targetRoute || (params.role === 'consumer' ? '/profile' : '/business-dashboard');
        return { success: true, targetRoute, user: res.user };
      }),
      catchError((err) => {
        if (err.status === 0) {
          const updatedProfile = {
            ...this.profile(),
            id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
            name: params.name,
            email: params.email,
            phone: params.phone || this.profile().phone || '',
            role: params.role,
            bio: params.bio || (params.role === 'business_owner' ? `Master Artisan & Owner of ${params.businessName || 'Handcraft Studio'}` : this.profile().bio),
            joinedDate: 'Just now'
          };
          this.profile.set(updatedProfile as any);
          this.userRole.set(params.role);
          this.isLoggedIn.set(true);
          localStorage.setItem('voziba_user_profile', JSON.stringify(updatedProfile));
          localStorage.setItem('voziba_user_role', params.role);
          localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));
          const targetRoute = params.role === 'consumer' ? '/profile' : '/business-dashboard';
          return of({ success: true, targetRoute });
        }
        return throwError(() => err);
      })
    );
  }

  loginWithRole(params: LoginParams): Observable<{ success: boolean; targetRoute: string; user?: any }> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, {
      email: params.email,
      password: params.password,
      role: params.role
    }).pipe(
      map((res) => {
        if (res.accessToken || res.token) {
          this.saveTokens(res.accessToken || res.token, res.refreshToken);
        }
        const updatedProfile = {
          ...this.profile(),
          email: res.user?.email || params.email,
          name: res.user?.name || params.name || params.email.split('@')[0],
          role: res.user?.role || params.role,
          phone: res.user?.phone || this.profile().phone,
          bio: res.user?.bio || this.profile().bio,
          businessName: res.user?.businessName || this.profile().businessName,
        };
        this.profile.set(updatedProfile as any);
        this.userRole.set(updatedProfile.role as any);
        this.isLoggedIn.set(true);
        localStorage.setItem('voziba_user_profile', JSON.stringify(updatedProfile));
        localStorage.setItem('voziba_user_role', updatedProfile.role as string);
        localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));

        const targetRoute = res.targetRoute || (updatedProfile.role === 'business_owner' ? '/business-dashboard' : '/profile');
        return { success: true, targetRoute, user: res.user };
      }),
      catchError((err) => {
        if (err.status === 0) {
          const updatedProfile = {
            ...this.profile(),
            email: params.email,
            name: params.name || params.email.split('@')[0],
            role: params.role
          };
          this.profile.set(updatedProfile as any);
          this.userRole.set(params.role);
          this.isLoggedIn.set(true);
          localStorage.setItem('voziba_user_profile', JSON.stringify(updatedProfile));
          localStorage.setItem('voziba_user_role', params.role);
          localStorage.setItem('voziba_is_logged_in', JSON.stringify(true));
          const targetRoute = params.role === 'consumer' ? '/profile' : '/business-dashboard';
          return of({ success: true, targetRoute });
        }
        return throwError(() => err);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('voziba_access_token') || localStorage.getItem('voziba_jwt_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('voziba_refresh_token');
  }

  saveTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('voziba_access_token', accessToken);
    localStorage.setItem('voziba_jwt_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('voziba_refresh_token', refreshToken);
    }
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  refreshTokenApi() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return this.http.post<any>(`${this.apiUrl}/auth/refresh`, {});
    }
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken });
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, { email, newPassword });
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.setItem('voziba_is_logged_in', JSON.stringify(false));
    localStorage.removeItem('voziba_access_token');
    localStorage.removeItem('voziba_refresh_token');
    localStorage.removeItem('voziba_jwt_token');
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
    localStorage.removeItem('voziba_access_token');
    localStorage.removeItem('voziba_refresh_token');
    localStorage.removeItem('voziba_jwt_token');
    return DEFAULT_PROFILE;
  }
}

