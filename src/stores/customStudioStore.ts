import { create } from 'zustand';
import { Product } from '@/lib/products';
import {
  ShapeType,
  LengthType,
  FinishType,
  EffectType,
  RhinestoneTier,
  CharmTier,
  NailArtType,
  FingerIndex,
  SHAPE_PRICES,
  LENGTH_PRICES,
  FINISH_PRICES,
  EFFECTS_PRICES,
  RHINESTONE_PRICES,
  CHARM_PRICES,
  NAIL_ART_PRICES,
  ACCENT_FINISH_CHANGE_PRICE,
  BASE_CUSTOM_SET_PRICE,
} from '@/lib/pricing';

// Types
export type EntryMode = 'fresh' | 'from-product';

export interface ColorPalette {
  name: string;
  colors: string[];
}

export interface AccentNailConfig {
  finish?: FinishType;
  color?: string;
  effects?: EffectType[];
}

export interface EffectApplication {
  effect: EffectType;
  scope: 'all' | 'accents-only';
  nails?: Set<FingerIndex>;
}

export interface PredefinedArtwork {
  type: NailArtType;
  nails: Set<FingerIndex>;
}

export interface CustomArtworkRequest {
  description: string;
  inspirationImages: string[];
  nails: Set<FingerIndex>;
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  isQuoteRequired?: boolean;
}

export interface PriceBreakdown {
  items: PriceBreakdownItem[];
  subtotal: number;
  hasQuoteItems: boolean;
}

export const STEP_NAMES = [
  'Starting Point',
  'Base Look',
  'Accent Nails',
  'Effects & Add-ons',
  'Custom Artwork',
  'Review & Submit',
] as const;

export type StepName = typeof STEP_NAMES[number];

interface CustomStudioState {
  // Navigation
  currentStep: number;
  
  // Step 1: Starting Point
  entryMode: EntryMode;
  baseProduct: Product | null;
  
  // Step 2: Base Look
  shape: ShapeType;
  length: LengthType;
  baseFinish: FinishType;
  colorPalette: ColorPalette | null;
  nailColors: Record<FingerIndex, string>;
  
  // Step 3: Accent Nails
  hasAccentNails: boolean;
  accentNails: Set<FingerIndex>;
  accentConfigs: Partial<Record<FingerIndex, AccentNailConfig>>;
  
  // Step 4: Effects & Add-ons
  effects: EffectApplication[];
  rhinestoneTier: RhinestoneTier;
  charmTier: CharmTier;
  charmPreferences: string;
  
  // Step 5: Custom Artwork
  predefinedArtwork: PredefinedArtwork[];
  customArtwork: CustomArtworkRequest | null;
  
  // General
  notes: string;
  inspirationImages: string[];
}

interface CustomStudioActions {
  // Navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: () => boolean;
  
  // Step 1
  setEntryMode: (mode: EntryMode) => void;
  setBaseProduct: (product: Product | null) => void;
  
  // Step 2
  setShape: (shape: ShapeType) => void;
  setLength: (length: LengthType) => void;
  setBaseFinish: (finish: FinishType) => void;
  setColorPalette: (palette: ColorPalette | null) => void;
  setNailColor: (finger: FingerIndex, color: string) => void;
  
  // Step 3
  setHasAccentNails: (has: boolean) => void;
  toggleAccentNail: (finger: FingerIndex) => void;
  setAccentConfig: (finger: FingerIndex, config: AccentNailConfig) => void;
  
  // Step 4
  addEffect: (effect: EffectApplication) => void;
  removeEffect: (effectType: EffectType) => void;
  updateEffectScope: (effectType: EffectType, scope: 'all' | 'accents-only') => void;
  setRhinestoneTier: (tier: RhinestoneTier) => void;
  setCharmTier: (tier: CharmTier) => void;
  setCharmPreferences: (prefs: string) => void;
  
  // Step 5
  addPredefinedArtwork: (artwork: PredefinedArtwork) => void;
  removePredefinedArtwork: (type: NailArtType) => void;
  setCustomArtwork: (artwork: CustomArtworkRequest | null) => void;
  
  // General
  setNotes: (notes: string) => void;
  addInspirationImage: (url: string) => void;
  removeInspirationImage: (url: string) => void;
  
  // Pricing
  getPriceBreakdown: () => PriceBreakdown;
  
  // Reset
  resetStudio: () => void;
}

const defaultNailColors: Record<FingerIndex, string> = {
  0: '', 1: '', 2: '', 3: '', 4: '',
  5: '', 6: '', 7: '', 8: '', 9: '',
};

const initialState: CustomStudioState = {
  currentStep: 0,
  entryMode: 'fresh',
  baseProduct: null,
  shape: 'almond',
  length: 'medium',
  baseFinish: 'glossy',
  colorPalette: null,
  nailColors: { ...defaultNailColors },
  hasAccentNails: false,
  accentNails: new Set(),
  accentConfigs: {},
  effects: [],
  rhinestoneTier: 'none',
  charmTier: 'none',
  charmPreferences: '',
  predefinedArtwork: [],
  customArtwork: null,
  notes: '',
  inspirationImages: [],
};

export const useCustomStudioStore = create<CustomStudioState & CustomStudioActions>((set, get) => ({
  ...initialState,
  
  // Navigation
  setStep: (step) => set({ currentStep: Math.max(0, Math.min(5, step)) }),
  
  nextStep: () => {
    const { currentStep, canProceed } = get();
    if (canProceed() && currentStep < 5) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  canProceed: () => {
    const state = get();
    switch (state.currentStep) {
      case 0: // Starting Point
        return state.entryMode === 'fresh' || state.baseProduct !== null;
      case 1: // Base Look
        return state.shape !== null && state.length !== null && state.baseFinish !== null;
      case 2: // Accent Nails
        return !state.hasAccentNails || state.accentNails.size > 0;
      case 3: // Effects & Add-ons
        return true; // Optional step
      case 4: // Custom Artwork
        return true; // Optional step
      case 5: // Review
        return true;
      default:
        return false;
    }
  },
  
  // Step 1
  setEntryMode: (mode) => set({ entryMode: mode }),
  setBaseProduct: (product) => set({ baseProduct: product, entryMode: product ? 'from-product' : 'fresh' }),
  
  // Step 2
  setShape: (shape) => set({ shape }),
  setLength: (length) => set({ length }),
  setBaseFinish: (finish) => set({ baseFinish: finish }),
  setColorPalette: (palette) => set({ colorPalette: palette }),
  setNailColor: (finger, color) => set((state) => ({
    nailColors: { ...state.nailColors, [finger]: color },
  })),
  
  // Step 3
  setHasAccentNails: (has) => set({ 
    hasAccentNails: has,
    accentNails: has ? get().accentNails : new Set(),
    accentConfigs: has ? get().accentConfigs : {},
  }),
  
  toggleAccentNail: (finger) => set((state) => {
    const newAccentNails = new Set(state.accentNails);
    const newAccentConfigs = { ...state.accentConfigs };
    
    if (newAccentNails.has(finger)) {
      newAccentNails.delete(finger);
      delete newAccentConfigs[finger];
    } else {
      newAccentNails.add(finger);
      newAccentConfigs[finger] = {};
    }
    
    return { accentNails: newAccentNails, accentConfigs: newAccentConfigs };
  }),
  
  setAccentConfig: (finger, config) => set((state) => ({
    accentConfigs: { ...state.accentConfigs, [finger]: config },
  })),
  
  // Step 4
  addEffect: (effect) => set((state) => ({
    effects: [...state.effects.filter(e => e.effect !== effect.effect), effect],
  })),
  
  removeEffect: (effectType) => set((state) => ({
    effects: state.effects.filter(e => e.effect !== effectType),
  })),
  
  updateEffectScope: (effectType, scope) => set((state) => ({
    effects: state.effects.map(e => 
      e.effect === effectType ? { ...e, scope } : e
    ),
  })),
  
  setRhinestoneTier: (tier) => set({ rhinestoneTier: tier }),
  setCharmTier: (tier) => set({ charmTier: tier }),
  setCharmPreferences: (prefs) => set({ charmPreferences: prefs }),
  
  // Step 5
  addPredefinedArtwork: (artwork) => set((state) => ({
    predefinedArtwork: [...state.predefinedArtwork.filter(a => a.type !== artwork.type), artwork],
  })),
  
  removePredefinedArtwork: (type) => set((state) => ({
    predefinedArtwork: state.predefinedArtwork.filter(a => a.type !== type),
  })),
  
  setCustomArtwork: (artwork) => set({ customArtwork: artwork }),
  
  // General
  setNotes: (notes) => set({ notes }),
  
  addInspirationImage: (url) => set((state) => ({
    inspirationImages: [...state.inspirationImages, url],
  })),
  
  removeInspirationImage: (url) => set((state) => ({
    inspirationImages: state.inspirationImages.filter(img => img !== url),
  })),
  
  // Pricing
  getPriceBreakdown: () => {
    const state = get();
    const items: PriceBreakdownItem[] = [];
    
    // Base price
    if (state.baseProduct) {
      items.push({ label: `Base: ${state.baseProduct.title}`, amount: state.baseProduct.price });
    } else {
      items.push({ label: 'Custom Set Base', amount: BASE_CUSTOM_SET_PRICE });
    }
    
    // Shape modifier
    const shapePrice = SHAPE_PRICES[state.shape];
    if (shapePrice > 0) {
      items.push({ label: `Shape: ${state.shape}`, amount: shapePrice });
    }
    
    // Length modifier
    const lengthPrice = LENGTH_PRICES[state.length];
    if (lengthPrice > 0) {
      items.push({ label: `Length: ${state.length}`, amount: lengthPrice });
    }
    
    // Finish modifier
    const finishPrice = FINISH_PRICES[state.baseFinish];
    if (finishPrice > 0) {
      items.push({ label: `Finish: ${state.baseFinish}`, amount: finishPrice });
    }
    
    // Accent nail finish changes
    const accentFinishChanges = Object.values(state.accentConfigs).filter(
      config => config?.finish && config.finish !== state.baseFinish
    ).length;
    if (accentFinishChanges > 0) {
      items.push({ 
        label: `Accent finish changes (×${accentFinishChanges})`, 
        amount: accentFinishChanges * ACCENT_FINISH_CHANGE_PRICE 
      });
    }
    
    // Effects
    for (const effectApp of state.effects) {
      const effectPricing = EFFECTS_PRICES[effectApp.effect];
      if (effectApp.scope === 'all') {
        items.push({ label: `${effectApp.effect} (all nails)`, amount: effectPricing.allNails });
      } else {
        const nailCount = effectApp.nails?.size || state.accentNails.size;
        items.push({ 
          label: `${effectApp.effect} (×${nailCount} nails)`, 
          amount: nailCount * effectPricing.perNail 
        });
      }
    }
    
    // Rhinestones
    const rhinestonePrice = RHINESTONE_PRICES[state.rhinestoneTier];
    if (rhinestonePrice > 0) {
      items.push({ label: `Rhinestones: ${state.rhinestoneTier}`, amount: rhinestonePrice });
    }
    
    // Charms
    const charmPrice = CHARM_PRICES[state.charmTier];
    if (charmPrice > 0) {
      items.push({ label: `Charms: ${state.charmTier}`, amount: charmPrice });
    }
    
    // Predefined artwork
    for (const artwork of state.predefinedArtwork) {
      const artPricing = NAIL_ART_PRICES[artwork.type];
      if (artPricing.type === 'per-set') {
        items.push({ label: `Nail art: ${artwork.type}`, amount: artPricing.price });
      } else {
        const nailCount = artwork.nails.size;
        items.push({ 
          label: `Nail art: ${artwork.type} (×${nailCount})`, 
          amount: nailCount * artPricing.price 
        });
      }
    }
    
    // Custom artwork (quote required)
    if (state.customArtwork) {
      items.push({ 
        label: 'Custom artwork', 
        amount: 0, 
        isQuoteRequired: true 
      });
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const hasQuoteItems = items.some(item => item.isQuoteRequired);
    
    return { items, subtotal, hasQuoteItems };
  },
  
  // Reset
  resetStudio: () => set({ ...initialState, accentNails: new Set(), accentConfigs: {} }),
}));
