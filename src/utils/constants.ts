export const SITE_TITLE = 'TravelScope';
export const SITE_DESCRIPTION = 'Your ultimate travel guide to cities around the world. Discover things to do, where to eat, where to stay, and practical tips for 200+ destinations.';
export const SITE_URL = 'https://yourdomain.com';

export const CATEGORIES = [
  { id: 'Essentials', label: 'Essentials', icon: '📋' },
  { id: 'Things to Do', label: 'Things to Do', icon: '🎯' },
  { id: 'Experiences & Activities', label: 'Experiences', icon: '🎢' },
  { id: 'Attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'Itineraries', label: 'Itineraries', icon: '🗓️' },
  { id: 'Food & Dining', label: 'Food & Dining', icon: '🍽️' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'Transport', label: 'Transport', icon: '🚇' },
  { id: 'Special Guides', label: 'Special Guides', icon: '⭐' },
  { id: 'Seasonal & Monthly', label: 'Seasonal', icon: '🌤️' },
  { id: 'Hotels & Accommodation', label: 'Hotels', icon: '🏨' },
  { id: 'Practical Information', label: 'Practical Info', icon: 'ℹ️' },
  { id: 'Visa & Entry', label: 'Visa & Entry', icon: '🛂' },
  { id: 'Money & Payments', label: 'Money', icon: '💰' },
  { id: 'Booking & Experiences', label: 'Booking', icon: '🎟️' },
  { id: 'Yacht & Cruise', label: 'Yacht & Cruise', icon: '🚢' },
  { id: 'Activities Planning', label: 'Activities', icon: '🏄' },
  { id: 'Holiday Packages', label: 'Packages', icon: '📦' },
  { id: 'Trust & Conversion', label: 'Tips & Trust', icon: '✅' },
  { id: 'Comparisons', label: 'Comparisons', icon: '⚖️' },
] as const;

export const CITIES: Record<string, { name: string; country: string; slug: string }> = {
  dubai: { name: 'Dubai', country: 'United Arab Emirates', slug: 'dubai' },
  paris: { name: 'Paris', country: 'France', slug: 'paris' },
  bangkok: { name: 'Bangkok', country: 'Thailand', slug: 'bangkok' },
  london: { name: 'London', country: 'United Kingdom', slug: 'london' },
  singapore: { name: 'Singapore', country: 'Singapore', slug: 'singapore' },
  tokyo: { name: 'Tokyo', country: 'Japan', slug: 'tokyo' },
  istanbul: { name: 'Istanbul', country: 'Turkey', slug: 'istanbul' },
  rome: { name: 'Rome', country: 'Italy', slug: 'rome' },
  bali: { name: 'Bali', country: 'Indonesia', slug: 'bali' },
  newyork: { name: 'New York', country: 'United States', slug: 'new-york' },
  // Add 190+ more cities here...
};

export const POSTS_PER_PAGE = 12;
