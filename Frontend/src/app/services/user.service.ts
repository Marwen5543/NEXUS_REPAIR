import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}/profile`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/profile`,
      request,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/password`,
      request,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/account`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
