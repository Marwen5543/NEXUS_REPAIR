import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Response interfaces matching backend DTOs
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface SignOutRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private deviceIdKey = 'device_id';

  // Observable to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken(),
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.ensureDeviceId();
  }

  /**
   * Sign up with email and password
   */
  signup(fullName: string, email: string, password: string): Observable<AuthResponse> {
    const request: SignUpRequest = {
      email: email.toLowerCase(),
      password: password,
      fullName: fullName // ← Include fullName
    };

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/signup`,
      request,
      { headers: this.getDeviceHeaders() }
    ).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Sign in with email and password
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const request: SignInRequest = {
      email: email.toLowerCase(),
      password: password
    };

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/signin`,
      request,
      { headers: this.getDeviceHeaders() }
    ).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshRequest = {
      refreshToken: refreshToken,
    };

    return this.http
      .post<any>(`${this.apiUrl}/refresh`, request, {
        headers: this.getDeviceHeaders(),
      })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => {
          this.clearTokens();
          return throwError(() => error);
        }),
      );
  }

  /**
   * Sign out from current device
   */
  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearTokens();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: SignOutRequest = {
      refreshToken: refreshToken,
    };

    return this.http.post<void>(`${this.apiUrl}/signout`, request).pipe(
      tap(() => this.clearTokens()),
      catchError((error) => {
        this.clearTokens();
        return throwError(() => error);
      }),
    );
  }

  /**
   * Sign out from all devices
   */
  logoutAllDevices(): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/signout-all`,
        {},
        { headers: this.getAuthHeaders() },
      )
      .pipe(
        tap(() => this.clearTokens()),
        catchError((error) => {
          this.clearTokens();
          return throwError(() => error);
        }),
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Update authentication observable value
   */
  public setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  /**
   * Get stored access token
   */
  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  /**
   * Get stored refresh token
   */
  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Get authorization headers with Bearer token
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get device-specific headers
   */
  private getDeviceHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Device-Id': this.getDeviceId(),
      'X-Client-IP': 'unknown',
    });
  }

  /**
   * Handle successful authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear all stored tokens
   */
  public clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check if valid token exists
   */
  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const payload = this.parseJwt(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Parse JWT token to get payload
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Get current user info from JWT token
   * Now fullName will be directly in the JWT payload!
   */
  getCurrentUser(): User | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const payload = this.parseJwt(token);

      return {
        id: payload.sub,
        email: payload.email,
        fullName: payload.fullName, // ← This will now be in the JWT!
        roles: payload.roles || []
      };
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return null;
    }
  }

  /**
   * Ensure device ID exists
   */
  private ensureDeviceId(): void {
    let deviceId = localStorage.getItem(this.deviceIdKey);
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem(this.deviceIdKey, deviceId);
    }
  }

  /**
   * Get device ID
   */
  private getDeviceId(): string {
    return localStorage.getItem(this.deviceIdKey) || this.generateDeviceId();
  }

  /**
   * Generate unique device ID
   */
  private generateDeviceId(): string {
    return (
      'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.status === 409) {
        errorMessage = 'Email already exists';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }

    console.error('Auth error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * OAuth placeholder methods
   */
  loginWithGoogle(): Observable<AuthResponse> {
    console.warn('Google OAuth not implemented yet');
    return throwError(() => new Error('Google OAuth not implemented'));
  }

  loginWithFacebook(): Observable<AuthResponse> {
    console.warn('Facebook OAuth not implemented yet');
    return throwError(() => new Error('Facebook OAuth not implemented'));
  }
}
