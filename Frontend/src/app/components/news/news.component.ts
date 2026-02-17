import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface NewsAuthor {
  id: string;
  name: string;
  avatar: string;
  role: 'client' | 'provider' | 'admin';
  verified: boolean;
}

interface ServiceReview {
  serviceType: string;
  rating: number;
  providerName: string;
  location: string;
}

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: NewsAuthor;
  publishedDate: Date;
  readTime: number; // minutes
  category: 'review' | 'experience' | 'tip' | 'announcement';
  tags: string[];
  coverImage: string;
  likes: number;
  comments: number;
  views: number;
  featured: boolean;
  serviceReview?: ServiceReview;
}

interface NewsCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  selectedCategory: string = 'all';
  searchQuery: string = '';
  sortBy: 'latest' | 'popular' | 'trending' = 'latest';

  categories: NewsCategory[] = [
    { id: 'all', name: 'All Posts', icon: 'grid', count: 24 },
    { id: 'review', name: 'Service Reviews', icon: 'star', count: 12 },
    { id: 'experience', name: 'Experiences', icon: 'message-circle', count: 8 },
    { id: 'tip', name: 'Tips & Guides', icon: 'lightbulb', count: 3 },
    { id: 'announcement', name: 'Announcements', icon: 'bell', count: 1 }
  ];

  featuredPost: NewsPost = {
    id: '1',
    title: 'Exceptional Plumbing Service Saved My Kitchen Renovation',
    excerpt: 'After three failed attempts with other providers, I finally found a professional plumber through NEXUS REPAIR who completely transformed my experience.',
    content: '',
    author: {
      id: 'usr_001',
      name: 'Sarah Mitchell',
      avatar: 'SM',
      role: 'client',
      verified: true
    },
    publishedDate: new Date('2024-02-14'),
    readTime: 5,
    category: 'review',
    tags: ['Plumbing', 'Kitchen', 'Emergency Service'],
    coverImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
    likes: 156,
    comments: 23,
    views: 1240,
    featured: true,
    serviceReview: {
      serviceType: 'Plumbing',
      rating: 5,
      providerName: 'Ahmed Ben Salah',
      location: 'Tunis, La Marsa'
    }
  };

  newsPosts: NewsPost[] = [
    {
      id: '2',
      title: 'How GPS Tracking Made My AC Repair Stress-Free',
      excerpt: 'Real-time tracking feature let me plan my day perfectly while waiting for the HVAC technician to arrive.',
      content: '',
      author: {
        id: 'usr_002',
        name: 'Karim Hamdi',
        avatar: 'KH',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-02-12'),
      readTime: 4,
      category: 'experience',
      tags: ['HVAC', 'GPS Tracking', 'Summer'],
      coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      likes: 89,
      comments: 12,
      views: 654,
      featured: false,
      serviceReview: {
        serviceType: 'HVAC',
        rating: 5,
        providerName: 'Mohamed Trabelsi',
        location: 'Tunis, Centre Ville'
      }
    },
    {
      id: '3',
      title: 'Electrical Work Done Right: My Smart Home Installation',
      excerpt: 'From initial consultation to final testing, this electrician demonstrated true professionalism and expertise.',
      content: '',
      author: {
        id: 'usr_003',
        name: 'Leila Ben Ahmed',
        avatar: 'LB',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-02-10'),
      readTime: 6,
      category: 'review',
      tags: ['Electrical', 'Smart Home', 'Installation'],
      coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
      likes: 124,
      comments: 18,
      views: 892,
      featured: false,
      serviceReview: {
        serviceType: 'Electrical',
        rating: 5,
        providerName: 'Sofiane Gharbi',
        location: 'Ariana, Ennasr'
      }
    },
    {
      id: '4',
      title: '5 Tips for Choosing the Right Service Provider',
      excerpt: 'Learn from my experience booking over 10 services through NEXUS REPAIR.',
      content: '',
      author: {
        id: 'usr_004',
        name: 'Youssef Sassi',
        avatar: 'YS',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-02-08'),
      readTime: 7,
      category: 'tip',
      tags: ['Guide', 'Tips', 'Best Practices'],
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      likes: 201,
      comments: 34,
      views: 1567,
      featured: false
    },
    {
      id: '5',
      title: 'Emergency Plumbing at Midnight: A True Lifesaver',
      excerpt: 'Water leak at 2 AM? Here\'s how NEXUS REPAIR\'s 24/7 service saved my apartment.',
      content: '',
      author: {
        id: 'usr_005',
        name: 'Nadia Khelifi',
        avatar: 'NK',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-02-06'),
      readTime: 5,
      category: 'experience',
      tags: ['Emergency', 'Plumbing', '24/7 Service'],
      coverImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop',
      likes: 178,
      comments: 29,
      views: 1123,
      featured: false,
      serviceReview: {
        serviceType: 'Plumbing',
        rating: 5,
        providerName: 'Hichem Fourati',
        location: 'Tunis, Menzah'
      }
    },
    {
      id: '6',
      title: 'Painting Service Exceeded All Expectations',
      excerpt: 'Professional painters transformed my apartment in just 3 days with impeccable results.',
      content: '',
      author: {
        id: 'usr_006',
        name: 'Rania Tlili',
        avatar: 'RT',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-02-04'),
      readTime: 4,
      category: 'review',
      tags: ['Painting', 'Interior Design', 'Renovation'],
      coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop',
      likes: 95,
      comments: 15,
      views: 743,
      featured: false,
      serviceReview: {
        serviceType: 'Painting',
        rating: 5,
        providerName: 'Bilel Mejri',
        location: 'Sfax, Centre'
      }
    },
    {
      id: '7',
      title: 'Carpentry Magic: Custom Furniture That Fits Perfectly',
      excerpt: 'Working with a skilled carpenter through NEXUS REPAIR to create bespoke storage solutions.',
      content: '',
      author: {
        id: 'usr_007',
        name: 'Mehdi Bouzid',
        avatar: 'MB',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-02-02'),
      readTime: 6,
      category: 'review',
      tags: ['Carpentry', 'Custom Work', 'Furniture'],
      coverImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=600&fit=crop',
      likes: 142,
      comments: 21,
      views: 987,
      featured: false,
      serviceReview: {
        serviceType: 'Carpentry',
        rating: 5,
        providerName: 'Tarek Miled',
        location: 'Sousse, Sahloul'
      }
    },
    {
      id: '8',
      title: 'NEW: AI-Powered Chat Payment Feature Launch',
      excerpt: 'NEXUS REPAIR introduces revolutionary payment system that generates cards from your conversations.',
      content: '',
      author: {
        id: 'admin_001',
        name: 'NEXUS REPAIR Team',
        avatar: 'NR',
        role: 'admin',
        verified: true
      },
      publishedDate: new Date('2024-02-01'),
      readTime: 3,
      category: 'announcement',
      tags: ['Update', 'AI', 'Payment', 'Feature'],
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      likes: 312,
      comments: 56,
      views: 2341,
      featured: false
    },
    {
      id: '9',
      title: 'Appliance Repair Done in Record Time',
      excerpt: 'My washing machine was fixed in under an hour - here\'s my complete experience.',
      content: '',
      author: {
        id: 'usr_008',
        name: 'Ines Chaabane',
        avatar: 'IC',
        role: 'client',
        verified: true
      },
      publishedDate: new Date('2024-01-30'),
      readTime: 4,
      category: 'experience',
      tags: ['Appliance Repair', 'Quick Service'],
      coverImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
      likes: 67,
      comments: 9,
      views: 542,
      featured: false,
      serviceReview: {
        serviceType: 'Appliance Repair',
        rating: 5,
        providerName: 'Amine Karoui',
        location: 'Monastir, Centre'
      }
    }
  ];

  // Filtered posts based on category and search
  filteredPosts: NewsPost[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  changeSortBy(sort: 'latest' | 'popular' | 'trending'): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  applyFilters(): void {
    let posts = [...this.newsPosts];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      posts = posts.filter(post => post.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'latest':
        posts.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
        break;
      case 'popular':
        posts.sort((a, b) => b.likes - a.likes);
        break;
      case 'trending':
        posts.sort((a, b) => b.views - a.views);
        break;
    }

    this.filteredPosts = posts;
  }

  viewPost(postId: string): void {
    this.router.navigate(['/news', postId]);
  }

  likePost(post: NewsPost, event: Event): void {
    event.stopPropagation();
    post.likes++;
    // TODO: Call API to persist like
  }

  sharePost(post: NewsPost, event: Event): void {
    event.stopPropagation();
    // TODO: Implement share functionality
    console.log('Sharing post:', post.title);
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }


getSectionTitle(): string {
  if (this.searchQuery) {
    return `Search Results for "${this.searchQuery}"`;
  }

  const category = this.categories.find(cat => cat.id === this.selectedCategory);
  if (category && this.selectedCategory !== 'all') {
    return category.name;
  }

  return 'Latest Articles';
}

}
