export interface User {
  id: string;
  email: string;
  fullName?: string;
  roles: string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  route: string;
  urgent?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  route: string;
}

export interface Feature {
  id: string;
  title: string;
  icon: string;
  route: string;
}

export interface HowItWorksStep {
  id: number;
  title: string;
  icon: string;
  route: string;
}

// Service Categories
export const SERVICES: ServiceCategory[] = [
  { id: 'plumbing', title: 'Plumbing', icon: '🔧', route: '/services/plomberie' },
  { id: 'electrical', title: 'Electrical', icon: '⚡', route: '/services/electricite' },
  { id: 'hvac', title: 'Heating & Cooling', icon: '❄️', route: '/services/climatisation' },
  { id: 'appliance', title: 'Appliance Repair', icon: '🔌', route: '/services/electromenager' },
  { id: 'auto', title: 'Mobile Auto Repair', icon: '🚗', route: '/services/mecanique' },
  { id: 'cleaning', title: 'Cleaning & Maintenance', icon: '🧹', route: '/services/nettoyage' },
  { id: 'painting', title: 'Painting & Handyman', icon: '🎨', route: '/services/peinture' },
  { id: 'locksmith', title: 'Emergency Locksmith', icon: '🔑', route: '/services/serrurier', urgent: true }
];

// Emergency services (highlighted)
export const EMERGENCY_SERVICES: ServiceCategory[] = [
  { id: 'leak', title: 'Water Leak / Drainage', icon: '💧', route: '/services/urgence/fuite', urgent: true },
  { id: 'power', title: 'Power Outage', icon: '⚡', route: '/services/urgence/electricite', urgent: true },
  { id: 'locksmith', title: 'Emergency Locksmith', icon: '🔑', route: '/services/urgence/serrurier', urgent: true }
];

// Features
export const FEATURES: Feature[] = [
  { id: 'verified', title: 'Verified & Rated Providers', icon: '✓', route: '/features/verified' },
  { id: 'tracking', title: 'Real-time GPS Tracking', icon: '📍', route: '/features/tracking' },
  { id: 'ai-chat', title: 'Secure Chat + AI Suggestions', icon: '💬', route: '/features/ai-chat' },
  { id: 'payment', title: 'Secure & Transparent Payments', icon: '💳', route: '/features/payment' },
  { id: 'fast', title: 'Fast Response (<1h)', icon: '⚡', route: '/features/fast-response' },
  { id: 'guarantee', title: '100% Satisfaction Guarantee', icon: '🛡️', route: '/features/guarantee' },
  { id: 'support', title: 'Customer Support (7 days/week)', icon: '📞', route: '/features/support' }
];

// How it works steps
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { id: 1, title: 'Describe your need', icon: '📝', route: '/how-it-works#step-1' },
  { id: 2, title: 'Receive quick quotes', icon: '💰', route: '/how-it-works#step-2' },
  { id: 3, title: 'Choose your provider', icon: '👤', route: '/how-it-works#step-3' },
  { id: 4, title: 'Live tracking & payment', icon: '📱', route: '/how-it-works#step-4' }
];

// Coverage zones (Tunisia)
export const ZONES: Zone[] = [
  { id: 'tunis', name: 'Tunis', route: '/zones/tunis' },
  { id: 'ariana', name: 'Ariana', route: '/zones/ariana' },
  { id: 'ben-arous', name: 'Ben Arous', route: '/zones/ben-arous' },
  { id: 'manouba', name: 'Manouba', route: '/zones/manouba' },
  { id: 'sfax', name: 'Sfax', route: '/zones/sfax' },
  { id: 'sousse', name: 'Sousse', route: '/zones/sousse' },
  { id: 'nabeul', name: 'Nabeul', route: '/zones/nabeul' },
  { id: 'bizerte', name: 'Bizerte', route: '/zones/bizerte' }
];
