import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface User {
  id: string;
  email: string;
  fullName?: string;
  roles: string[];
}

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
  private authSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  // Subscribe to authentication state
  this.authSubscription.add(
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.authService.getCurrentUser();

        // DEBUG: Check what's in the token
        console.log('Current User:', this.currentUser);
        const token = this.authService.getAccessToken();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('JWT Payload:', payload);
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        }
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
    const userMenu = document.querySelector('.user-menu');
    const mobileMenu = document.querySelector('.mobile-menu-btn');

    if (userMenu && !userMenu.contains(target)) {
      this.showUserMenu = false;
    }

    if (mobileMenu && !mobileMenu.contains(target) && !target.closest('.mobile-menu')) {
      this.showMobileMenu = false;
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
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout on client side even if API fails
        this.authService.clearTokens();
        this.showUserMenu = false;
        this.router.navigate(['/home']);
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

  scrollToSection(sectionId: string): void {
    this.closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
