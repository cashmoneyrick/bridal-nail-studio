import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ShapeType, LengthType, FinishType, BaseType, EffectType,
  RhinestoneTier, CharmTier,
  SHAPE_PRICES, LENGTH_PRICES, FINISH_PRICES,
  EFFECTS_PRICES, RHINESTONE_PRICES, CHARM_PRICES,
  BASE_CUSTOM_SET_PRICE,
  FingerIndex,
} from '@/lib/pricing';

export interface NailConfig {
  color: string;
  baseType: BaseType;
  secondaryColor?: string;
  finish: FinishType;
  artDesigns: string[];
}

const DEFAULT_NAIL_CONFIG: NailConfig = {
  color: '#F8E8E0',
  baseType: 'solid',
  finish: 'glossy',
  artDesigns: [],
};

interface CustomStudioState {
  // Navigation
  activeSection: number;

  // Global design (all nails)
  shape: ShapeType;
  length: LengthType;
  defaultNailConfig: NailConfig;

  // Per-nail overrides
  nailOverrides: Partial<Record<FingerIndex, Partial<NailConfig>>>;
  editMode: 'all' | 'per-nail';
  selectedNailIndex: FingerIndex | null;
  activeHand: 'left' | 'right';

  // Extras
  rhinestoneTier: RhinestoneTier;
  charmTier: CharmTier;
  effects: EffectType[];

  // Inspiration
  inspirationImages: string[];
  inspirationNotes: string;
  specialInstructions: string;

  // Submission
  isSubmitting: boolean;
  isComplete: boolean;
}

interface CustomStudioActions {
  setActiveSection: (section: number) => void;
  setShape: (shape: ShapeType) => void;
  setLength: (length: LengthType) => void;
  setDefaultNailConfig: (config: Partial<NailConfig>) => void;
  setEditMode: (mode: 'all' | 'per-nail') => void;
  selectNail: (index: FingerIndex | null) => void;
  setActiveHand: (hand: 'left' | 'right') => void;
  setNailOverride: (index: FingerIndex, override: Partial<NailConfig>) => void;
  clearNailOverride: (index: FingerIndex) => void;
  copyToAll: (index: FingerIndex) => void;
  copyToOtherHand: () => void;
  toggleEffect: (effect: EffectType) => void;
  setRhinestoneTier: (tier: RhinestoneTier) => void;
  setCharmTier: (tier: CharmTier) => void;
  addInspirationImage: (blobUrl: string) => void;
  removeInspirationImage: (index: number) => void;
  setInspirationNotes: (notes: string) => void;
  setSpecialInstructions: (instructions: string) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setIsComplete: (complete: boolean) => void;
  getNailConfig: (index: FingerIndex) => NailConfig;
  estimatedPrice: () => number;
  reset: () => void;
}

const initialState: CustomStudioState = {
  activeSection: 0,
  shape: 'almond',
  length: 'medium',
  defaultNailConfig: { ...DEFAULT_NAIL_CONFIG },
  nailOverrides: {},
  editMode: 'all',
  selectedNailIndex: null,
  activeHand: 'left',
  rhinestoneTier: 'none',
  charmTier: 'none',
  effects: [],
  inspirationImages: [],
  inspirationNotes: '',
  specialInstructions: '',
  isSubmitting: false,
  isComplete: false,
};

export const useCustomStudioStore = create<CustomStudioState & CustomStudioActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveSection: (activeSection) => set({ activeSection }),

      setShape: (shape) => set({ shape }),

      setLength: (length) => set({ length }),

      setDefaultNailConfig: (config) => set((state) => ({
        defaultNailConfig: { ...state.defaultNailConfig, ...config },
      })),

      setEditMode: (editMode) => set({ editMode }),

      selectNail: (selectedNailIndex) => set({ selectedNailIndex }),

      setActiveHand: (activeHand) => set({ activeHand }),

      setNailOverride: (index, override) => set((state) => ({
        nailOverrides: {
          ...state.nailOverrides,
          [index]: { ...state.nailOverrides[index], ...override },
        },
      })),

      clearNailOverride: (index) => set((state) => {
        const { [index]: _, ...rest } = state.nailOverrides;
        return { nailOverrides: rest };
      }),

      copyToAll: (index) => {
        const override = get().nailOverrides[index];
        if (!override) return;
        const newOverrides: Partial<Record<FingerIndex, Partial<NailConfig>>> = {};
        for (let i = 0; i < 10; i++) {
          if (i !== index) {
            newOverrides[i as FingerIndex] = { ...override };
          }
        }
        set((state) => ({
          nailOverrides: { ...state.nailOverrides, ...newOverrides },
        }));
      },

      copyToOtherHand: () => {
        const state = get();
        const isLeft = state.activeHand === 'left';
        const sourceStart = isLeft ? 0 : 5;
        const targetStart = isLeft ? 5 : 0;
        const newOverrides = { ...state.nailOverrides };
        for (let i = 0; i < 5; i++) {
          const sourceIdx = (sourceStart + i) as FingerIndex;
          const targetIdx = (targetStart + (4 - i)) as FingerIndex;
          const sourceOverride = state.nailOverrides[sourceIdx];
          if (sourceOverride) {
            newOverrides[targetIdx] = { ...sourceOverride };
          }
        }
        set({ nailOverrides: newOverrides });
      },

      toggleEffect: (effect) => set((state) => ({
        effects: state.effects.includes(effect)
          ? state.effects.filter((e) => e !== effect)
          : [...state.effects, effect],
      })),

      setRhinestoneTier: (rhinestoneTier) => set({ rhinestoneTier }),

      setCharmTier: (charmTier) => set({ charmTier }),

      addInspirationImage: (blobUrl) => set((state) => ({
        inspirationImages: state.inspirationImages.length < 5
          ? [...state.inspirationImages, blobUrl]
          : state.inspirationImages,
      })),

      removeInspirationImage: (index) => set((state) => ({
        inspirationImages: state.inspirationImages.filter((_, i) => i !== index),
      })),

      setInspirationNotes: (inspirationNotes) => set({ inspirationNotes }),

      setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

      setIsComplete: (isComplete) => set({ isComplete }),

      getNailConfig: (index) => {
        const state = get();
        const override = state.nailOverrides[index];
        if (!override) return state.defaultNailConfig;
        return { ...state.defaultNailConfig, ...override };
      },

      estimatedPrice: () => {
        const state = get();
        let total = BASE_CUSTOM_SET_PRICE;
        total += SHAPE_PRICES[state.shape];
        total += LENGTH_PRICES[state.length];
        total += FINISH_PRICES[state.defaultNailConfig.finish];
        for (const effect of state.effects) {
          total += EFFECTS_PRICES[effect].allNails;
        }
        total += RHINESTONE_PRICES[state.rhinestoneTier];
        total += CHARM_PRICES[state.charmTier];
        return total;
      },

      reset: () => set({ ...initialState, defaultNailConfig: { ...DEFAULT_NAIL_CONFIG } }),
    }),
    {
      name: 'yourprettysets-custom-studio',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        shape: state.shape,
        length: state.length,
        defaultNailConfig: state.defaultNailConfig,
        nailOverrides: state.nailOverrides,
        effects: state.effects,
        rhinestoneTier: state.rhinestoneTier,
        charmTier: state.charmTier,
      }),
    }
  )
);
