import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string; // ✅ ADDED: required for category filtering
  providers: number;
  rating: number;
  reviews: number;    // ✅ ADDED: total reviews count
  minPrice: string;   // ✅ ADDED: starting price
  image: string;
  tags: string[];     // ✅ ADDED: searchable tags
}

interface Provider {
  id: number;
  name: string;
  avatar: string;
  service: string;
  category: string;   // ✅ ADDED: required for category filtering
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  distanceValue: number; // ✅ ADDED: numeric value for sorting
  price: string;
  priceValue: number;    // ✅ ADDED: numeric value for sorting
  available: boolean;
  verified: boolean;
  completedJobs: number; // ✅ ADDED: credibility metric
  responseTime: string;  // ✅ ADDED: UX detail
  specialty: string;     // ✅ ADDED: extra detail
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = 'all';
  sortBy: string = 'recommended';
  viewMode: 'services' | 'providers' = 'services';

  categories: Category[] = [
    { id: 'all',        name: 'All Services', icon: 'grid',        count: 12 },
    { id: 'plumbing',   name: 'Plumbing',     icon: 'droplet',     count: 3  },
    { id: 'electrical', name: 'Electrical',   icon: 'zap',         count: 2  },
    { id: 'appliances', name: 'Appliances',   icon: 'tool',        count: 2  },
    { id: 'cleaning',   name: 'Cleaning',     icon: 'wind',        count: 2  },
    { id: 'hvac',       name: 'HVAC',         icon: 'thermometer', count: 3  }
  ];

  services: Service[] = [
    {
      id: 1,
      title: 'Plumbing Services',
      description: 'Professional pipe installation, leak repairs, and full drainage solutions for residential and commercial properties.',
      icon: 'droplet',
      category: 'plumbing',
      providers: 156,
      rating: 4.9,
      reviews: 1840,
      minPrice: '30 DT',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      tags: ['pipes', 'leak', 'drainage', 'water', 'installation']
    },
    {
      id: 2,
      title: 'Electrical Work',
      description: 'Certified electricians for wiring, panel upgrades, outlet installation, and full electrical repairs.',
      icon: 'zap',
      category: 'electrical',
      providers: 124,
      rating: 4.8,
      reviews: 1320,
      minPrice: '40 DT',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      tags: ['wiring', 'electrician', 'panel', 'outlet', 'circuit']
    },
    {
      id: 3,
      title: 'Appliance Repair',
      description: 'Quick and reliable fixes for washing machines, fridges, ovens, and all major home appliances.',
      icon: 'tool',
      category: 'appliances',
      providers: 89,
      rating: 4.7,
      reviews: 976,
      minPrice: '35 DT',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      tags: ['washing machine', 'fridge', 'oven', 'dishwasher', 'dryer']
    },
    {
      id: 4,
      title: 'Deep Cleaning',
      description: 'Thorough home and office cleaning using professional-grade products and equipment.',
      icon: 'wind',
      category: 'cleaning',
      providers: 203,
      rating: 4.9,
      reviews: 2510,
      minPrice: '25 DT',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80&fit=crop',
      tags: ['cleaning', 'maid', 'house', 'office', 'disinfection']
    },
    {
      id: 5,
      title: 'HVAC Services',
      description: 'Expert heating, ventilation, and air conditioning installation, maintenance, and repair.',
      icon: 'thermometer',
      category: 'hvac',
      providers: 67,
      rating: 4.8,
      reviews: 754,
      minPrice: '50 DT',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80&fit=crop',
      tags: ['air conditioning', 'heating', 'ventilation', 'ac', 'climate']
    },
    {
      id: 6,
      title: 'Painting Services',
      description: 'Interior and exterior painting with premium-grade finishes and colour consultation.',
      icon: 'paint-bucket',
      category: 'cleaning',
      providers: 145,
      rating: 4.6,
      reviews: 1190,
      minPrice: '20 DT',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
      tags: ['paint', 'interior', 'exterior', 'walls', 'colour']
    },
    {
      id: 7,
      title: 'Carpentry',
      description: 'Custom furniture, door repairs, shelving, and precision woodwork for homes and offices.',
      icon: 'hammer',
      category: 'appliances',
      providers: 78,
      rating: 4.7,
      reviews: 688,
      minPrice: '45 DT',
      image: 'https://images.unsplash.com/photo-1611462985358-60d3498e0364?w=400',
      tags: ['furniture', 'wood', 'door', 'shelving', 'carpenter']
    },
    {
      id: 8,
      title: 'Pest Control',
      description: 'Safe and effective pest elimination using certified products for homes and businesses.',
      icon: 'bug',
      category: 'cleaning',
      providers: 42,
      rating: 4.5,
      reviews: 412,
      minPrice: '60 DT',
      image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80&fit=crop',
      tags: ['pest', 'insects', 'rodents', 'disinfection', 'fumigation']
    },
    {
      id: 9,
      title: 'Landscaping',
      description: 'Professional garden design, lawn care, trimming, and outdoor space improvements.',
      icon: 'tree',
      category: 'cleaning',
      providers: 56,
      rating: 4.8,
      reviews: 534,
      minPrice: '35 DT',
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400',
      tags: ['garden', 'lawn', 'trees', 'outdoor', 'landscape']
    },
    {
      id: 10,
      title: 'Security Systems',
      description: 'CCTV installation, smart alarm systems, and complete home security solutions.',
      icon: 'shield',
      category: 'electrical',
      providers: 34,
      rating: 4.9,
      reviews: 298,
      minPrice: '80 DT',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400',
      tags: ['cctv', 'camera', 'alarm', 'security', 'smart home']
    },
    {
      id: 11,
      title: 'Pool Maintenance',
      description: 'Weekly pool cleaning, chemical balancing, pump servicing, and water quality testing.',
      icon: 'waves',
      category: 'plumbing',
      providers: 28,
      rating: 4.7,
      reviews: 234,
      minPrice: '70 DT',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400',
      tags: ['pool', 'swimming', 'water', 'cleaning', 'chemical']
    },
    {
      id: 12,
      title: 'Moving Services',
      description: 'Professional packing, furniture moving, and secure storage solutions across Tunisia.',
      icon: 'truck',
      category: 'plumbing',
      providers: 91,
      rating: 4.6,
      reviews: 876,
      minPrice: '100 DT',
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400',
      tags: ['moving', 'packing', 'furniture', 'storage', 'relocation']
    }
  ];

  providers: Provider[] = [
    {
      id: 1,
      name: 'Mohamed Ben Ali',
      avatar: 'MB',
      service: 'Plumbing',
      category: 'plumbing',
      rating: 4.9,
      reviews: 234,
      location: 'Tunis, Ariana',
      distance: '2.3 km',
      distanceValue: 2.3,
      price: 'From 30 DT',
      priceValue: 30,
      available: true,
      verified: true,
      completedJobs: 412,
      responseTime: '~15 min',
      specialty: 'Leak detection & pipe replacement'
    },
    {
      id: 2,
      name: 'Sarra Khemiri',
      avatar: 'SK',
      service: 'Electrical',
      category: 'electrical',
      rating: 4.8,
      reviews: 189,
      location: 'Sousse, Kantaoui',
      distance: '5.1 km',
      distanceValue: 5.1,
      price: 'From 40 DT',
      priceValue: 40,
      available: true,
      verified: true,
      completedJobs: 298,
      responseTime: '~30 min',
      specialty: 'Panel upgrades & smart wiring'
    },
    {
      id: 3,
      name: 'Ahmed Trabelsi',
      avatar: 'AT',
      service: 'Appliance Repair',
      category: 'appliances',
      rating: 4.7,
      reviews: 156,
      location: 'Sfax, Centre Ville',
      distance: '8.4 km',
      distanceValue: 8.4,
      price: 'From 35 DT',
      priceValue: 35,
      available: false,
      verified: true,
      completedJobs: 187,
      responseTime: '~1 hour',
      specialty: 'Washing machines & fridges'
    },
    {
      id: 4,
      name: 'Leila Mansour',
      avatar: 'LM',
      service: 'Deep Cleaning',
      category: 'cleaning',
      rating: 4.9,
      reviews: 312,
      location: 'Tunis, La Marsa',
      distance: '1.8 km',
      distanceValue: 1.8,
      price: 'From 25 DT',
      priceValue: 25,
      available: true,
      verified: true,
      completedJobs: 534,
      responseTime: '~20 min',
      specialty: 'Post-construction & deep clean'
    },
    {
      id: 5,
      name: 'Youssef Gharbi',
      avatar: 'YG',
      service: 'HVAC',
      category: 'hvac',
      rating: 4.8,
      reviews: 98,
      location: 'Nabeul, Hammamet',
      distance: '12.6 km',
      distanceValue: 12.6,
      price: 'From 50 DT',
      priceValue: 50,
      available: true,
      verified: true,
      completedJobs: 143,
      responseTime: '~45 min',
      specialty: 'AC installation & gas refill'
    },
    {
      id: 6,
      name: 'Nadia Bouazizi',
      avatar: 'NB',
      service: 'Painting',
      category: 'cleaning',
      rating: 4.6,
      reviews: 145,
      location: 'Monastir, Kairouan',
      distance: '7.2 km',
      distanceValue: 7.2,
      price: 'From 20 DT',
      priceValue: 20,
      available: true,
      verified: false,
      completedJobs: 96,
      responseTime: '~1 hour',
      specialty: 'Interior walls & decorative finishes'
    }
  ];

  filteredServices: Service[] = [];
  filteredProviders: Provider[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredServices = [...this.services];
    this.filteredProviders = [...this.providers];
  }

  onSearch(): void {
    this.filterContent();
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterContent();
  }

  changeSortBy(sort: string): void {
    this.sortBy = sort;
    // ✅ FIX: re-filter first so sort operates on filtered set
    this.filterContent();
  }

  setViewMode(mode: 'services' | 'providers'): void {
    this.viewMode = mode;
    // ✅ FIX: re-filter when switching view so results stay consistent
    this.filterContent();
  }

  filterContent(): void {
    const q = this.searchQuery.toLowerCase().trim();

    // ✅ FIX: always filter BOTH, not just the current view mode
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = !q ||
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.tags.some(tag => tag.includes(q));
      const matchesCategory = this.selectedCategory === 'all' ||
        service.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });

    this.filteredProviders = this.providers.filter(provider => {
      const matchesSearch = !q ||
        provider.name.toLowerCase().includes(q) ||
        provider.service.toLowerCase().includes(q) ||
        provider.specialty.toLowerCase().includes(q);
      const matchesCategory = this.selectedCategory === 'all' ||
        provider.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });

    this.sortContent();
  }

  sortContent(): void {
    switch (this.sortBy) {
      case 'popular':
        this.filteredServices.sort((a, b) => b.providers - a.providers);
        this.filteredProviders.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'rating':
        this.filteredServices.sort((a, b) => b.rating - a.rating);
        this.filteredProviders.sort((a, b) => b.rating - a.rating);
        break;
      case 'nearest':
        this.filteredProviders.sort((a, b) => a.distanceValue - b.distanceValue);
        break;
      case 'price':
        this.filteredProviders.sort((a, b) => a.priceValue - b.priceValue);
        break;
      default:
        // 'recommended' — available first, then by rating
        this.filteredProviders.sort((a, b) => {
          if (a.available !== b.available) return a.available ? -1 : 1;
          return b.rating - a.rating;
        });
        break;
    }
  }

  selectService(service: Service): void {
    // Navigate to service detail or emit event
    console.log('Selected service:', service);
  }

  viewProvider(provider: Provider): void {
    console.log('Viewing provider:', provider);
  }

  bookProvider(provider: Provider): void {
    if (!provider.available) return;
    console.log('Booking provider:', provider);
  }

  formatNumber(num: number): string {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  }

  getCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategory);
    return category ? category.name : 'Services';
  }

  getStarArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  // ✅ ADDED: half-star helper
  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  // ✅ ADDED: gradient color per category icon
  getCategoryColor(id: string): string {
    const map: Record<string, string> = {
      all: '#0ea5e9',
      plumbing: '#3b82f6',
      electrical: '#f59e0b',
      appliances: '#8b5cf6',
      cleaning: '#10b981',
      hvac: '#06b6d4'
    };
    return map[id] || '#0ea5e9';
  }

  // ✅ ADDED: avatar gradient per initials
  getAvatarGradient(avatar: string): string {
    const gradients: Record<string, string> = {
      MB: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
      SK: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      AT: 'linear-gradient(135deg, #059669, #10b981)',
      LM: 'linear-gradient(135deg, #dc2626, #f87171)',
      YG: 'linear-gradient(135deg, #d97706, #f59e0b)',
      NB: 'linear-gradient(135deg, #0891b2, #06b6d4)'
    };
    return gradients[avatar] || 'linear-gradient(135deg, #0284c7, #0ea5e9)';
  }
}
