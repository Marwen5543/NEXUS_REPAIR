import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { SERVICES, EMERGENCY_SERVICES, FEATURES, HOW_IT_WORKS_STEPS, ZONES, User, ServiceCategory, Zone } from './header.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: User | null = null;
  showUserMenu = false;
  showMobileMenu = false;
  isScrolled = false;

  // Dropdown states
  showServicesDropdown = false;
  showFeaturesDropdown = false;
  showHowItWorksDropdown = false;
  showZonesDropdown = false;

  private authSubscription: Subscription = new Subscription();

  // Service Categories
  services = SERVICES;

  // Emergency services (highlighted)
  emergencyServices = EMERGENCY_SERVICES;

  // Features
  features = FEATURES;

  // How it works steps
  howItWorksSteps = HOW_IT_WORKS_STEPS;

  // Coverage zones (Tunisia)
  zones = ZONES;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.currentUser = this.authService.getCurrentUser();
        } else {
          this.currentUser = null;
        }
      })
    );

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Close all dropdowns if clicking outside
    if (!target.closest('.nav-item')) {
      this.closeAllDropdowns();
    }

    // Close user menu
    if (!target.closest('.user-menu')) {
      this.showUserMenu = false;
    }

    // Close mobile menu
    if (!target.closest('.mobile-menu-btn') && !target.closest('.mobile-menu')) {
      this.showMobileMenu = false;
    }
  }

  closeAllDropdowns(): void {
    this.showServicesDropdown = false;
    this.showFeaturesDropdown = false;
    this.showHowItWorksDropdown = false;
    this.showZonesDropdown = false;
  }

  toggleDropdown(dropdown: string): void {
    this.closeAllDropdowns();

    switch(dropdown) {
      case 'services':
        this.showServicesDropdown = !this.showServicesDropdown;
        break;
      case 'features':
        this.showFeaturesDropdown = !this.showFeaturesDropdown;
        break;
      case 'how-it-works':
        this.showHowItWorksDropdown = !this.showHowItWorksDropdown;
        break;
      case 'zones':
        this.showZonesDropdown = !this.showZonesDropdown;
        break;
    }
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
  }

  toggleMobileMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
    this.closeAllDropdowns();
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  getUserInitials(): string {
    if (this.currentUser?.fullName) {
      const names = this.currentUser.fullName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (this.currentUser?.email) {
      return this.currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getUserDisplayName(): string {
    if (this.currentUser?.fullName) {
      return this.currentUser.fullName;
    }
    if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0];
    }
    return 'User';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showUserMenu = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.authService.clearTokens();
        this.showUserMenu = false;
        this.router.navigate(['/']);
      }
    });
  }

  navigateToProfile(): void {
    this.closeUserMenu();
    this.router.navigate(['/profile']);
  }

  navigateToDashboard(): void {
    this.closeUserMenu();
    this.router.navigate(['/dashboard']);
  }

  navigateToSettings(): void {
    this.closeUserMenu();
    this.router.navigate(['/settings']);
  }

  navigateToPostRequest(): void {
    this.closeUserMenu();
    this.closeMobileMenu();
    this.router.navigate(['/requests/new']);
  }

  navigateToMyRequests(): void {
    this.closeUserMenu();
    this.closeMobileMenu();
    this.router.navigate(['/requests/my-requests']);
  }

  navigateTo(route: string): void {
    this.closeAllDropdowns();
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  openWhatsApp(): void {
    // Replace with your WhatsApp business number
    const phoneNumber = '21612345678'; // Tunisia format
    const message = 'Hello, I need help with NEXUS REPAIR';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }

  callSupport(): void {
    // Replace with your support phone number
    window.location.href = 'tel:+21612345678';
  }
}
