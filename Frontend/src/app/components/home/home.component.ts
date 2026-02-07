import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  searchQuery = '';
  selectedLocation = '';

  // Hero section
  heroStats: Stat[] = [
    { value: '50K+', label: 'Verified Providers', icon: 'users' },
    { value: '200K+', label: 'Jobs Completed', icon: 'check-circle' },
    { value: '98%', label: 'Satisfaction Rate', icon: 'star' },
    { value: '24/7', label: 'Support Available', icon: 'clock' }
  ];

  // Popular services
  popularServices: Service[] = [
    {
      id: '1',
      icon: 'droplet',
      title: 'Plumbing',
      description: 'Professional plumbers for all your pipe, drain, and water system needs',
      category: 'plumbing'
    },
    {
      id: '2',
      icon: 'zap',
      title: 'Electrical',
      description: 'Licensed electricians for repairs, installations, and maintenance',
      category: 'electrical'
    },
    {
      id: '3',
      icon: 'tool',
      title: 'Carpentry',
      description: 'Expert carpenters for furniture, repairs, and custom woodwork',
      category: 'carpentry'
    },
    {
      id: '4',
      icon: 'wind',
      title: 'HVAC',
      description: 'Heating, ventilation, and air conditioning specialists',
      category: 'hvac'
    },
    {
      id: '5',
      icon: 'settings',
      title: 'Appliance Repair',
      description: 'Fix your home appliances quickly and efficiently',
      category: 'appliance'
    },
    {
      id: '6',
      icon: 'paint-bucket',
      title: 'Painting',
      description: 'Professional painters for interior and exterior projects',
      category: 'painting'
    },
    {
      id: '7',
      icon: 'sparkles',
      title: 'Cleaning',
      description: 'Deep cleaning services for homes and offices',
      category: 'cleaning'
    },
    {
      id: '8',
      icon: 'tree',
      title: 'Landscaping',
      description: 'Garden maintenance and landscape design services',
      category: 'landscaping'
    }
  ];

  // Platform features
  features: Feature[] = [
    {
      icon: 'map-pin',
      title: 'Real-Time GPS Tracking',
      description: 'Watch your service provider arrive in real-time on an interactive map. Know exactly when they\'ll reach you.'
    },
    {
      icon: 'message-circle',
      title: 'Encrypted Chat',
      description: 'Secure, private messaging between you and your provider. Discuss details, share photos, and coordinate seamlessly.'
    },
    {
      icon: 'credit-card',
      title: 'Dynamic Payments',
      description: 'AI-powered payment cards generated from your conversations. Transparent pricing with no hidden fees.'
    },
    {
      icon: 'shield-check',
      title: 'Verified Providers',
      description: 'Every professional is background-checked and verified. Read reviews and ratings from real customers.'
    },
    {
      icon: 'clock',
      title: '24/7 Support',
      description: 'Our customer support team is always available to help with any questions or concerns.'
    },
    {
      icon: 'award',
      title: 'Quality Guarantee',
      description: 'All work is backed by our satisfaction guarantee. If you\'re not happy, we\'ll make it right.'
    }
  ];

  // How it works steps
  steps = [
    {
      number: '01',
      title: 'Search & Select',
      description: 'Browse available services and choose the professional that fits your needs',
      icon: 'search'
    },
    {
      number: '02',
      title: 'Book & Track',
      description: 'Schedule your service and watch your provider arrive in real-time on the map',
      icon: 'map'
    },
    {
      number: '03',
      title: 'Chat & Confirm',
      description: 'Communicate securely about job details and get AI-generated pricing',
      icon: 'message-square'
    },
    {
      number: '04',
      title: 'Pay & Review',
      description: 'Complete secure payment and share your experience to help others',
      icon: 'star'
    }
  ];

  // Testimonials
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Homeowner',
      avatar: 'SJ',
      rating: 5,
      comment: 'The real-time tracking feature is amazing! I could see exactly when the plumber was arriving. The whole experience was seamless and professional.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Business Owner',
      avatar: 'MC',
      rating: 5,
      comment: 'Best service platform I\'ve used. The encrypted chat made it easy to discuss the electrical work needed, and the pricing was transparent from the start.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Property Manager',
      avatar: 'ER',
      rating: 5,
      comment: 'Managing multiple properties, this platform has been a lifesaver. Verified providers, instant booking, and excellent tracking. Highly recommend!'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Homeowner',
      avatar: 'DT',
      rating: 5,
      comment: 'The AI-powered payment system is genius. No more haggling or surprise costs. Everything was clear and fair from the beginning.'
    }
  ];

  // Active testimonial for carousel
  activeTestimonialIndex = 0;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Start testimonial carousel
    this.startTestimonialCarousel();
  }

  // Search functionality
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/services'], {
        queryParams: {
          search: this.searchQuery,
          location: this.selectedLocation
        }
      });
    }
  }

  // Navigate to specific service
  selectService(service: Service): void {
    this.router.navigate(['/services'], {
      queryParams: { category: service.category }
    });
  }

  // Navigate to provider signup
  becomeProvider(): void {
    this.router.navigate(['/provider-signup']);
  }

  // Navigate to services
  exploreServices(): void {
    this.router.navigate(['/services']);
  }

  // Navigate to signup
  getStarted(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/signup']);
    }
  }

  // Testimonial carousel
  startTestimonialCarousel(): void {
    setInterval(() => {
      this.nextTestimonial();
    }, 5000); // Change every 5 seconds
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex =
      (this.activeTestimonialIndex + 1) % this.testimonials.length;
  }

  previousTestimonial(): void {
    this.activeTestimonialIndex =
      this.activeTestimonialIndex === 0
        ? this.testimonials.length - 1
        : this.activeTestimonialIndex - 1;
  }

  setActiveTestimonial(index: number): void {
    this.activeTestimonialIndex = index;
  }

  // Scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Generate star rating array
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }
}
