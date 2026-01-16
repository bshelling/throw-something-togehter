import { ClothingCategory, Occasion, UserMood, WardrobeItem, CalendarEvent } from './types';

export const INITIAL_WARDROBE: WardrobeItem[] = [
  {
    id: '1',
    category: ClothingCategory.TOP,
    name: 'White Silk Blouse',
    color: 'White',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    tags: ['classic', 'work', 'clean'],
    brand: 'Theory'
  },
  {
    id: '2',
    category: ClothingCategory.BOTTOM,
    name: 'High-waisted Wide Leg Trousers',
    color: 'Beige',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    tags: ['comfortable', 'chic', 'work'],
    brand: 'Zara'
  },
  {
    id: '3',
    category: ClothingCategory.OUTERWEAR,
    name: 'Oversized Wool Blazer',
    color: 'Charcoal',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    tags: ['trendy', 'layering', 'warm'],
    brand: 'Everlane'
  },
  {
    id: '4',
    category: ClothingCategory.SHOES,
    name: 'Leather Loafers',
    color: 'Black',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    tags: ['flat', 'walking', 'classic'],
    brand: 'Gucci'
  },
  {
    id: '5',
    category: ClothingCategory.DRESS,
    name: 'Floral Midi Dress',
    color: 'Multicolor',
    imageUrl: 'https://picsum.photos/200/200?random=5',
    tags: ['spring', 'brunch', 'flowy'],
    brand: 'Reformation'
  },
  {
    id: '6',
    category: ClothingCategory.ACCESSORY,
    name: 'Gold Hoop Earrings',
    color: 'Gold',
    imageUrl: 'https://picsum.photos/200/200?random=6',
    tags: ['jewelry', 'everyday'],
  },
  {
    id: '7',
    category: ClothingCategory.TOP,
    name: 'Cashmere Sweater',
    color: 'Cream',
    imageUrl: 'https://picsum.photos/200/200?random=7',
    tags: ['cozy', 'warm', 'soft'],
    brand: 'Uniqlo'
  },
  {
    id: '8',
    category: ClothingCategory.BOTTOM,
    name: 'Vintage 501 Jeans',
    color: 'Blue',
    imageUrl: 'https://picsum.photos/200/200?random=8',
    tags: ['casual', 'denim', 'sturdy'],
    brand: 'Levis'
  }
];

export const MOODS: UserMood[] = [
  { label: 'Confident', value: 'bold, structured, power-dressing', icon: '⚡' },
  { label: 'Comfortable', value: 'loose, soft fabrics, elastic waist, cozy (feeling bloated/tired)', icon: '☁️' },
  { label: 'Chic', value: 'trendy, minimalist, monochromatic', icon: '✨' },
  { label: 'Energetic', value: 'bright colors, sporty, functional', icon: '🔥' },
  { label: 'Romantic', value: 'soft textures, pastels, dresses', icon: '🌹' },
];

export const EVENTS = [
  { label: 'Office / Meetings', value: Occasion.WORK },
  { label: 'Casual / Errands', value: Occasion.CASUAL },
  { label: 'Date Night / Dinner', value: Occasion.DATE_NIGHT },
  { label: 'Travel / Airport', value: Occasion.TRAVEL },
  { label: 'Formal Event', value: Occasion.FORMAL },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', time: '09:00 AM', title: 'Q4 Strategy Review', type: Occasion.WORK },
  { id: '2', time: '01:00 PM', title: 'Lunch with Client', type: Occasion.WORK },
  { id: '3', time: '06:30 PM', title: 'Dinner at Nobu', type: Occasion.DATE_NIGHT },
];
