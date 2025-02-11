import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UserProfile } from '../models/user.interface';
import { environment } from '../../environments/environment';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userName: string;
  userRole: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UpdateProfileModel {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    })
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('[AuthService] Initialized');
  }

  private getLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('[AuthService] Attempting login with:', { email: credentials.email });
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, credentials, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('[AuthService] Login response:', response);
          if (isPlatformBrowser(this.platformId)) {
            this.setLocalStorage('token', response.token);
            this.setLocalStorage('userName', response.userName);
            this.setLocalStorage('userRole', response.userRole);
            console.log('[AuthService] Stored credentials in localStorage');
          }
        }),
        catchError(error => {
          console.error('[AuthService] Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/register`, data, this.httpOptions).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          this.setLocalStorage('token', response.token);
          this.setLocalStorage('userName', response.userName);
        }
      })
    );
  }

  verifyEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verify-email?email=${email}`);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    });
  }

  isLoggedIn(): boolean {
    return !!this.getLocalStorage('token');
  }

  isAdmin(): boolean {
    return this.getLocalStorage('userRole') === 'Admin';
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return this.getLocalStorage('token');
    }
    return null;
  }

  logout(): void {
    this.removeLocalStorage('token');
    this.removeLocalStorage('userName');
    this.removeLocalStorage('userRole');
    this.router.navigate(['/login']);
  }

  getUserProfile(): Observable<UserProfile | null> {
    console.log('[AuthService] Getting user profile');
    if (!isPlatformBrowser(this.platformId)) {
      console.log('[AuthService] Not in browser environment');
      return of(null);
    }

    const token = this.getLocalStorage('token');
    console.log('[AuthService] Token exists:', !!token);
    
    if (!token) {
      console.log('[AuthService] No token found, redirecting to login');
      this.router.navigate(['/login']);
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('[AuthService] Making API call with headers:', headers);

    return this.http.get<UserProfile>(`${this.apiUrl}/Users/profile`, { headers }).pipe(
      tap(profile => console.log('[AuthService] Profile retrieved:', profile)),
      catchError(error => {
        console.error('[AuthService] Error getting profile:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  updateProfile(updateData: UpdateProfileModel): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/Users/profile`, updateData);
  }

  getUserRole(): string | null {
    if (typeof window !== 'undefined') {
      return this.getLocalStorage('userRole');
    }
    return null;
  }

  // Add more methods as needed
} 