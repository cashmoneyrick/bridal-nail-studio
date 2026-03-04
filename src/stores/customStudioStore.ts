import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  effects?: EffectType[];
}

export interface EffectApplication {
  effect: EffectType;
  scope: 'all' | 'accents-only';
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

// Quiz card steps: 0=shape, 1=length, 2=finish, 3=color
export const QUIZ_STEPS = ['shape', 'length', 'finish', 'color'] as const;
export type QuizStepName = typeof QUIZ_STEPS[number];

interface CustomStudioState {
  // Quiz navigation (0-3 for cards, 4 = hub)
  quizStep: number;

  // Entry
  entryMode: EntryMode;
  baseProduct: Product | null;

  // Hub extras tracking
  expandedExtra: string | null;

  // Base Look
  shape: ShapeType | null;
  length: LengthType | null;
  baseFinish: FinishType | null;
  colorPalette: ColorPalette | null;
  nailColors: Record<FingerIndex, string>;
  selectedColors: string[];

  // Accent Nails
  hasAccentNails: boolean;
  accentNails: Set<FingerIndex>;
  accentConfigs: Partial<Record<FingerIndex, AccentNailConfig>>;

  // Effects & Add-ons
  effects: EffectApplication[];
  rhinestoneTier: RhinestoneTier;
  charmTier: CharmTier;
  charmPreferences: string;

  // Custom Artwork
  predefinedArtwork: PredefinedArtwork[];
  customArtwork: CustomArtworkRequest | null;

  // General
  notes: string;
  inspirationImages: string[];
}

interface CustomStudioActions {
  // Quiz navigation
  setQuizStep: (step: number) => void;
  nextQuizStep: () => void;
  prevQuizStep: () => void;
  goToHub: () => void;
  isQuizComplete: () => boolean;
  getRequiredComplete: () => boolean;

  // Hub extras
  setExpandedExtra: (id: string | null) => void;

  // Entry
  setEntryMode: (mode: EntryMode) => void;
  setBaseProduct: (product: Product | null) => void;

  // Base Look
  setShape: (shape: ShapeType) => void;
  setLength: (length: LengthType) => void;
  setBaseFinish: (finish: FinishType) => void;
  setColorPalette: (palette: ColorPalette | null) => void;
  setNailColor: (finger: FingerIndex, color: string) => void;
  addSelectedColor: (color: string) => void;
  removeSelectedColor: (color: string) => void;
  clearSelectedColors: () => void;

  // Accent Nails
  setHasAccentNails: (has: boolean) => void;
  toggleAccentNail: (finger: FingerIndex) => void;
  setAccentConfig: (finger: FingerIndex, config: AccentNailConfig) => void;

  // Effects & Add-ons
  addEffect: (effect: EffectApplication) => void;
  removeEffect: (effectType: EffectType) => void;
  updateEffectScope: (effectType: EffectType, scope: 'all' | 'accents-only') => void;
  setRhinestoneTier: (tier: RhinestoneTier) => void;
  setCharmTier: (tier: CharmTier) => void;
  setCharmPreferences: (prefs: string) => void;

  // Custom Artwork
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
  quizStep: 0,
  entryMode: 'fresh',
  baseProduct: null,
  expandedExtra: null,
  shape: null,
  length: null,
  baseFinish: null,
  colorPalette: null,
  nailColors: { ...defaultNailColors },
  selectedColors: [],
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

const STORAGE_KEY = 'custom-studio-storage';

// Custom serializer for Set objects
const customStorage = createJSONStorage<CustomStudioState & CustomStudioActions>(() => localStorage, {
  replacer: (_key, value) => {
    if (value instanceof Set) {
      return { __type: 'Set', values: Array.from(value) };
    }
    return value;
  },
  reviver: (_key, value) => {
    if (value && typeof value === 'object' && (value as Record<string, unknown>).__type === 'Set') {
      return new Set((value as { values: unknown[] }).values);
    }
    return value;
  },
});

export const useCustomStudioStore = create<CustomStudioState & CustomStudioActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Quiz navigation
      setQuizStep: (step) => set({ quizStep: Math.max(0, Math.min(4, step)) }),

      nextQuizStep: () => {
        const { quizStep } = get();
        if (quizStep < 4) {
          set({ quizStep: quizStep + 1 });
        }
      },

      prevQuizStep: () => {
        const { quizStep } = get();
        if (quizStep > 0) {
          set({ quizStep: quizStep - 1 });
        }
      },

      goToHub: () => set({ quizStep: 4 }),

      isQuizComplete: () => {
        const state = get();
        return !!state.colorPalette && state.selectedColors.length > 0;
      },

      getRequiredComplete: () => {
        const state = get();
        const hasColors = state.selectedColors.length > 0;
        const hasNailAssigned = Object.values(state.nailColors).some(color => color && color.length > 0);
        return !!state.shape && !!state.length && !!state.baseFinish && hasColors && hasNailAssigned;
      },

      // Hub extras
      setExpandedExtra: (id) => set({ expandedExtra: id }),

      // Entry
      setEntryMode: (mode) => set({ entryMode: mode }),
      setBaseProduct: (product) => set({ baseProduct: product, entryMode: product ? 'from-product' : 'fresh' }),

      // Base Look
      setShape: (shape) => set({ shape }),
      setLength: (length) => set({ length }),
      setBaseFinish: (finish) => set({ baseFinish: finish }),
      setColorPalette: (palette) => set({ colorPalette: palette }),
      setNailColor: (finger, color) => set((state) => ({
        nailColors: { ...state.nailColors, [finger]: color },
      })),
      addSelectedColor: (color) => set((state) => ({
        selectedColors: state.selectedColors.includes(color)
          ? state.selectedColors
          : [...state.selectedColors, color],
      })),
      removeSelectedColor: (color) => set((state) => ({
        selectedColors: state.selectedColors.filter(c => c !== color),
      })),
      clearSelectedColors: () => set({ selectedColors: [] }),

      // Accent Nails
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

        // Auto-set hasAccentNails based on selection
        return {
          accentNails: newAccentNails,
          accentConfigs: newAccentConfigs,
          hasAccentNails: newAccentNails.size > 0,
        };
      }),

      setAccentConfig: (finger, config) => set((state) => ({
        accentConfigs: { ...state.accentConfigs, [finger]: config },
      })),

      // Effects & Add-ons
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

      // Custom Artwork
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
            const nailCount = state.accentNails.size;
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
      resetStudio: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({
          ...initialState,
          accentNails: new Set(),
          accentConfigs: {},
          selectedColors: [],
          nailColors: { ...defaultNailColors },
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: customStorage,
      partialize: (state) => ({
        quizStep: state.quizStep,
        entryMode: state.entryMode,
        baseProduct: state.baseProduct,
        shape: state.shape,
        length: state.length,
        baseFinish: state.baseFinish,
        colorPalette: state.colorPalette,
        nailColors: state.nailColors,
        selectedColors: state.selectedColors,
        hasAccentNails: state.hasAccentNails,
        accentNails: state.accentNails,
        accentConfigs: state.accentConfigs,
        effects: state.effects,
        rhinestoneTier: state.rhinestoneTier,
        charmTier: state.charmTier,
        charmPreferences: state.charmPreferences,
        predefinedArtwork: state.predefinedArtwork,
        customArtwork: state.customArtwork,
        notes: state.notes,
        inspirationImages: state.inspirationImages,
      }) as CustomStudioState & CustomStudioActions,
    }
  )
);
