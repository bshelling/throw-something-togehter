export enum ClothingCategory {
  TOP = 'Top',
  BOTTOM = 'Bottom',
  DRESS = 'Dress',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORY = 'Accessory',
}

export enum Occasion {
  CASUAL = 'Casual',
  WORK = 'Work',
  FORMAL = 'Formal',
  DATE_NIGHT = 'Date Night',
  TRAVEL = 'Travel',
  GYM = 'Gym',
}

export interface WardrobeItem {
  id: string;
  category: ClothingCategory;
  name: string;
  color: string;
  imageUrl: string;
  tags: string[];
  brand?: string;
}

export interface UserMood {
  label: string;
  value: string; // description for AI
  icon: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO Date String YYYY-MM-DD
  time: string;
  title: string;
  type: Occasion;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  reasoning: string;
  items: WardrobeItem[]; // Existing items
  missingItems: { name: string; type: string; reason: string }[]; // Gap analysis
  weatherNote: string;
  moodMatch: string;
}

export interface GeneratedVisual {
  imageUrl: string;
  promptUsed: string;
}