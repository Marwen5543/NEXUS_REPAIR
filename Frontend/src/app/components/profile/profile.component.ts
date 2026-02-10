import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserProfile, UpdateProfileRequest } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  loading = false;
  profileLoading = false;
  passwordLoading = false;

  activeTab: 'profile' | 'security' | 'danger' = 'profile';

  successMessage = '';
  errorMessage = '';

  showDeleteConfirm = false;
  Boolean = Boolean;

  // ─── Add this array back ────────────────────────────────────────────────
  governorates: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba',
    'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
    'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ].sort((a, b) => a.localeCompare(b));   // optional: alphabetical sort

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.pattern(/^(\+216)?[24579]\d{7}$/)]],
      whatsappNumber: ['', [Validators.pattern(/^(\+216)?[24579]\d{7}$/)]],
      governorate: [''],
      city: [''],
      addressLine: [''],
      postalCode: ['', [Validators.pattern(/^\d{4}$/)]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          fullName: profile.fullName || '',
          phone: profile.phone || '',
          whatsappNumber: profile.whatsappNumber || '',
          governorate: profile.governorate || '',
          city: profile.city || '',
          addressLine: profile.addressLine || '',
          postalCode: profile.postalCode || ''
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.showError('Failed to load profile');
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched(); // better UX — show all errors
      return;
    }

    this.profileLoading = true;
    this.clearMessages();

    const formValue = this.profileForm.value;
    const request: UpdateProfileRequest = {
      fullName: formValue.fullName || undefined,
      phone: formValue.phone || undefined,
      whatsappNumber: formValue.whatsappNumber || undefined,
      governorate: formValue.governorate || undefined,
      city: formValue.city || undefined,
      addressLine: formValue.addressLine || undefined,
      postalCode: formValue.postalCode || undefined
    };

    this.userService.updateProfile(request).subscribe({
      next: (updatedProfile: UserProfile) => {
        this.profile = updatedProfile;
        this.showSuccess('Profile updated successfully');
        this.profileLoading = false;
        this.authService.setAuthenticated(true); // optional refresh
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this.showError(error.error?.message || 'Failed to update profile');
        this.profileLoading = false;
      }
    });
  }
  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordLoading = true;
    this.clearMessages();

    const request = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(request).subscribe({
      next: () => {
        this.showSuccess('Password changed successfully');
        this.passwordForm.reset();
        this.passwordLoading = false;
      },
      error: (error: any) => {
        console.error('Error changing password:', error);
        this.showError(error.error?.message || 'Failed to change password');
        this.passwordLoading = false;
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.clearTokens();
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error deleting account:', error);
        this.showError('Failed to delete account');
        this.showDeleteConfirm = false;
      }
    });
  }

  setActiveTab(tab: 'profile' | 'security' | 'danger'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 5000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getJoinedDate(): string {
    if (!this.profile?.createdAt) return '';
    return new Date(this.profile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
