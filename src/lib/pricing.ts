// Custom Studio Pricing Configuration
// All prices in USD

export type ShapeType = 'almond' | 'square' | 'oval' | 'coffin' | 'stiletto' | 'squoval' | 'round';
export type LengthType = 'extra-short' | 'short' | 'medium' | 'long' | 'extra-long';
export type FinishType = 'glossy' | 'matte' | 'velvet-matte' | 'chrome-finish' | 'holographic' | 'cat-eye' | 'sugar' | 'glass-aurora' | 'glitter-topcoat';
export type BaseType = 'solid' | 'french-tip-base' | 'ombre' | 'chrome-base' | 'jelly' | 'clear';
export type EffectType = 'chrome' | 'glitter' | 'french-tip';
export type RhinestoneTier = 'none' | 'just-a-touch' | 'a-little-sparkle' | 'full-glam';
export type CharmTier = 'none' | 'single-statement' | 'a-few-accents' | 'charmed-out';
export type NailArtType = 'simple-lines' | 'florals' | 'abstract' | 'themed-set';

export const SHAPE_PRICES: Record<ShapeType, number> = {
  almond: 0,
  square: 0,
  oval: 0,
  squoval: 0,
  round: 0,
  coffin: 5,
  stiletto: 8,
};

export const LENGTH_PRICES: Record<LengthType, number> = {
  'extra-short': 0,
  short: 0,
  medium: 5,
  long: 10,
  'extra-long': 15,
};

export const FINISH_PRICES: Record<FinishType, number> = {
  glossy: 0,
  matte: 5,
  'velvet-matte': 8,
  'chrome-finish': 15,
  holographic: 12,
  'cat-eye': 12,
  sugar: 8,
  'glass-aurora': 12,
  'glitter-topcoat': 10,
};

export const EFFECTS_PRICES: Record<EffectType, { allNails: number; perNail: number }> = {
  chrome: { allNails: 15, perNail: 3 },
  glitter: { allNails: 12, perNail: 2 },
  'french-tip': { allNails: 10, perNail: 2 },
};

export const RHINESTONE_PRICES: Record<RhinestoneTier, number> = {
  none: 0,
  'just-a-touch': 3,
  'a-little-sparkle': 8,
  'full-glam': 18,
};

export const CHARM_PRICES: Record<CharmTier, number> = {
  none: 0,
  'single-statement': 5,
  'a-few-accents': 12,
  'charmed-out': 20,
};

export const NAIL_ART_PRICES: Record<NailArtType, { type: 'per-nail' | 'per-set'; price: number }> = {
  'simple-lines': { type: 'per-nail', price: 5 },
  florals: { type: 'per-nail', price: 8 },
  abstract: { type: 'per-nail', price: 8 },
  'themed-set': { type: 'per-set', price: 25 },
};

// Price for changing finish on an accent nail (different from base)
export const ACCENT_FINISH_CHANGE_PRICE = 2;

// Base price for a custom set (starting point if no existing product selected)
export const BASE_CUSTOM_SET_PRICE = 35;

// Labels for display
export const SHAPE_LABELS: Record<ShapeType, string> = {
  almond: 'Almond',
  square: 'Square',
  oval: 'Oval',
  squoval: 'Squoval',
  round: 'Round',
  coffin: 'Coffin',
  stiletto: 'Stiletto',
};

export const LENGTH_LABELS: Record<LengthType, string> = {
  'extra-short': 'Extra Short',
  short: 'Short',
  medium: 'Medium',
  long: 'Long',
  'extra-long': 'Extra Long',
};

export const FINISH_LABELS: Record<FinishType, string> = {
  glossy: 'Glossy',
  matte: 'Matte',
  'velvet-matte': 'Velvet Matte',
  'chrome-finish': 'Chrome Mirror',
  holographic: 'Holographic',
  'cat-eye': 'Cat Eye',
  sugar: 'Sugar Textured',
  'glass-aurora': 'Glass Aurora',
  'glitter-topcoat': 'Glitter Topcoat',
};

export const BASE_TYPE_LABELS: Record<BaseType, string> = {
  solid: 'Solid',
  'french-tip-base': 'French Tip',
  ombre: 'Ombré',
  'chrome-base': 'Chrome',
  jelly: 'Jelly',
  clear: 'Clear',
};

export const EFFECT_LABELS: Record<EffectType, string> = {
  chrome: 'Chrome',
  glitter: 'Glitter',
  'french-tip': 'French Tip',
};

export const RHINESTONE_LABELS: Record<RhinestoneTier, string> = {
  none: 'None',
  'just-a-touch': 'Just a Touch',
  'a-little-sparkle': 'A Little Sparkle',
  'full-glam': 'Full Glam',
};

export const CHARM_LABELS: Record<CharmTier, string> = {
  none: 'None',
  'single-statement': 'Single Statement',
  'a-few-accents': 'A Few Accents',
  'charmed-out': 'Charmed Out',
};

export const NAIL_ART_LABELS: Record<NailArtType, string> = {
  'simple-lines': 'Simple Lines',
  florals: 'Florals',
  abstract: 'Abstract',
  'themed-set': 'Themed Set',
};

// Finger names for display
export const FINGER_NAMES = [
  'Left Pinky',
  'Left Ring',
  'Left Middle',
  'Left Index',
  'Left Thumb',
  'Right Thumb',
  'Right Index',
  'Right Middle',
  'Right Ring',
  'Right Pinky',
] as const;

export type FingerIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Named finger constants for easier reference
export const FINGER = {
  LEFT_PINKY: 0,
  LEFT_RING: 1,
  LEFT_MIDDLE: 2,
  LEFT_INDEX: 3,
  LEFT_THUMB: 4,
  RIGHT_THUMB: 5,
  RIGHT_INDEX: 6,
  RIGHT_MIDDLE: 7,
  RIGHT_RING: 8,
  RIGHT_PINKY: 9,
} as const;

// Hand groupings
export const LEFT_HAND: FingerIndex[] = [0, 1, 2, 3, 4];
export const RIGHT_HAND: FingerIndex[] = [5, 6, 7, 8, 9];

// Preset Color Palettes
export interface PresetColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[]; // 2-4 hex colors per palette
}

export const COLOR_PALETTES: PresetColorPalette[] = [
  {
    id: 'bridal-blush',
    name: 'Bridal Blush',
    description: 'Soft, romantic tones perfect for your special day',
    colors: ['#F8E8E0', '#E8D4C4', '#D4B8A8', '#C9A89A'],
  },
  {
    id: 'midnight-glam',
    name: 'Midnight Glam',
    description: 'Bold, sultry shades for evening elegance',
    colors: ['#1A1A2E', '#4A4E69', '#9A8C98'],
  },
  {
    id: 'french-romance',
    name: 'French Romance',
    description: 'Classic French manicure inspired palette',
    colors: ['#FDF5E6', '#FFE4E1', '#FFFFFF'],
  },
  {
    id: 'bold-beautiful',
    name: 'Bold & Beautiful',
    description: 'Vibrant, statement-making colors',
    colors: ['#C41E3A', '#FF6B6B', '#FFD93D', '#6BCB77'],
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Calming coastal-inspired hues',
    colors: ['#A8D8EA', '#AA96DA', '#FCBAD3'],
  },
];

// Individual color swatches for the color picker
export const PRESET_COLORS = [
  { name: 'Soft Pink', hex: '#F8C8D4' },
  { name: 'Dusty Rose', hex: '#C9A0A0' },
  { name: 'Blush', hex: '#F8E8E0' },
  { name: 'Nude', hex: '#E8D4C4' },
  { name: 'Cream', hex: '#FDF5E6' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Red', hex: '#C41E3A' },
  { name: 'Burgundy', hex: '#722F37' },
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Lavender', hex: '#B4A7D6' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Navy', hex: '#1A1A2E' },
  { name: 'Gold', hex: '#D4A574' },
  { name: 'Silver', hex: '#C0C0C0' },
] as const;
