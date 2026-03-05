import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ShapeType,
  LengthType,
  FinishType,
  EffectType,
  RhinestoneTier,
  CharmTier,
  SHAPE_PRICES,
  LENGTH_PRICES,
  FINISH_PRICES,
  EFFECTS_PRICES,
  RHINESTONE_PRICES,
  CHARM_PRICES,
  BASE_CUSTOM_SET_PRICE,
} from '@/lib/pricing';

// Simplified types for the new quiz flow
export type EffectOption = 'chrome' | 'glitter' | 'french';
export type RhinestoneLevel = 'none' | 'subtle' | 'medium' | 'heavy';
export type CharmLevel = 'none' | 'few' | 'lots';

// Mapping constants: new simplified types → pricing.ts types
export const EFFECT_TO_TYPE: Record<EffectOption, EffectType> = {
  chrome: 'chrome',
  glitter: 'glitter',
  french: 'french-tip',
};

export const RHINESTONE_TO_TIER: Record<RhinestoneLevel, RhinestoneTier> = {
  none: 'none',
  subtle: 'just-a-touch',
  medium: 'a-little-sparkle',
  heavy: 'full-glam',
};

export const CHARM_TO_TIER: Record<CharmLevel, CharmTier> = {
  none: 'none',
  few: 'single-statement',
  lots: 'charmed-out',
};

interface CustomStudioState {
  currentStep: number;

  // Step 0: Intent
  orderPath: 'cart' | 'quote' | null;

  // Step 1: Inspiration
  inspirationImages: string[];
  inspirationText: string;

  // Step 1: Basics
  shape: ShapeType | null;
  length: LengthType | null;
  finish: FinishType | null;

  // Step 2: Colors
  selectedColors: string[];
  colorNotes: string;

  // Step 3: Extras
  effects: EffectOption[];
  rhinestones: RhinestoneLevel;
  charms: CharmLevel;
  extraNotes: string;

  // Submission
  submissionType: 'cart' | 'quote' | null;
  isSubmitting: boolean;
  isComplete: boolean;
}

interface CustomStudioActions {
  // Navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canAdvance: () => boolean;

  // Step 0
  setOrderPath: (path: 'cart' | 'quote') => void;

  // Step 1
  addInspirationImage: (url: string) => void;
  removeInspirationImage: (url: string) => void;
  setInspirationText: (text: string) => void;

  // Step 1
  setShape: (shape: ShapeType) => void;
  setLength: (length: LengthType) => void;
  setFinish: (finish: FinishType) => void;

  // Step 2
  toggleColor: (color: string) => void;
  setColorNotes: (notes: string) => void;

  // Step 3
  toggleEffect: (effect: EffectOption) => void;
  setRhinestones: (level: RhinestoneLevel) => void;
  setCharms: (level: CharmLevel) => void;
  setExtraNotes: (notes: string) => void;

  // Pricing
  getEstimatedPrice: () => number;

  // Submission
  setSubmissionType: (type: 'cart' | 'quote') => void;
  setIsSubmitting: (val: boolean) => void;
  setIsComplete: (val: boolean) => void;

  // Reset
  resetStudio: () => void;
}

const initialState: CustomStudioState = {
  currentStep: 0,
  orderPath: null,
  inspirationImages: [],
  inspirationText: '',
  shape: null,
  length: null,
  finish: null,
  selectedColors: [],
  colorNotes: '',
  effects: [],
  rhinestones: 'none',
  charms: 'none',
  extraNotes: '',
  submissionType: null,
  isSubmitting: false,
  isComplete: false,
};

const STORAGE_KEY = 'custom-studio-storage';

export const useCustomStudioStore = create<CustomStudioState & CustomStudioActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setStep: (step) => set({ currentStep: Math.max(0, Math.min(5, step)) }),

      nextStep: () => {
        const { currentStep, canAdvance } = get();
        if (canAdvance() && currentStep < 5) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      canAdvance: () => {
        const state = get();
        switch (state.currentStep) {
          case 0:
            return state.orderPath !== null;
          case 1:
            return state.inspirationImages.length > 0 || state.inspirationText.trim().length > 0;
          case 2:
            return state.shape !== null && state.length !== null && state.finish !== null;
          case 3:
            return state.selectedColors.length > 0;
          case 4:
            return true;
          case 5:
            return true;
          default:
            return false;
        }
      },

      // Step 0: Intent
      setOrderPath: (path) => set({ orderPath: path }),

      // Step 1: Inspiration
      addInspirationImage: (url) => set((state) => ({
        inspirationImages: state.inspirationImages.length < 5
          ? [...state.inspirationImages, url]
          : state.inspirationImages,
      })),

      removeInspirationImage: (url) => set((state) => ({
        inspirationImages: state.inspirationImages.filter((img) => img !== url),
      })),

      setInspirationText: (text) => set({ inspirationText: text }),

      // Step 1: Basics
      setShape: (shape) => set({ shape }),
      setLength: (length) => set({ length }),
      setFinish: (finish) => set({ finish }),

      // Step 2: Colors
      toggleColor: (color) => set((state) => {
        if (state.selectedColors.includes(color)) {
          return { selectedColors: state.selectedColors.filter((c) => c !== color) };
        }
        if (state.selectedColors.length >= 8) return state;
        return { selectedColors: [...state.selectedColors, color] };
      }),

      setColorNotes: (notes) => set({ colorNotes: notes }),

      // Step 3: Extras
      toggleEffect: (effect) => set((state) => {
        if (state.effects.includes(effect)) {
          return { effects: state.effects.filter((e) => e !== effect) };
        }
        return { effects: [...state.effects, effect] };
      }),

      setRhinestones: (level) => set({ rhinestones: level }),
      setCharms: (level) => set({ charms: level }),
      setExtraNotes: (notes) => set({ extraNotes: notes }),

      // Pricing
      getEstimatedPrice: () => {
        const state = get();
        let total = BASE_CUSTOM_SET_PRICE;

        if (state.shape) total += SHAPE_PRICES[state.shape];
        if (state.length) total += LENGTH_PRICES[state.length];
        if (state.finish) total += FINISH_PRICES[state.finish];

        for (const effect of state.effects) {
          total += EFFECTS_PRICES[EFFECT_TO_TYPE[effect]].allNails;
        }

        total += RHINESTONE_PRICES[RHINESTONE_TO_TIER[state.rhinestones]];
        total += CHARM_PRICES[CHARM_TO_TIER[state.charms]];

        return total;
      },

      // Submission
      setSubmissionType: (type) => set({ submissionType: type }),
      setIsSubmitting: (val) => set({ isSubmitting: val }),
      setIsComplete: (val) => set({ isComplete: val }),

      // Reset
      resetStudio: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ ...initialState });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        currentStep: state.currentStep,
        orderPath: state.orderPath,
        inspirationImages: state.inspirationImages,
        inspirationText: state.inspirationText,
        shape: state.shape,
        length: state.length,
        finish: state.finish,
        selectedColors: state.selectedColors,
        colorNotes: state.colorNotes,
        effects: state.effects,
        rhinestones: state.rhinestones,
        charms: state.charms,
        extraNotes: state.extraNotes,
      } as CustomStudioState & CustomStudioActions),
    }
  )
);
