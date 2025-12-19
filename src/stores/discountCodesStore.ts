import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DiscountCode {
  code: string;
  description: string;
  source: string;
  receivedAt: string;
  used: boolean;
}

interface DiscountCodesStore {
  codes: DiscountCode[];
  appliedCode: string | null;
  
  addCode: (code: DiscountCode) => void;
  markAsUsed: (code: string) => void;
  applyCode: (code: string) => void;
  clearAppliedCode: () => void;
  hasCode: (code: string) => boolean;
}

export const useDiscountCodesStore = create<DiscountCodesStore>()(
  persist(
    (set, get) => ({
      codes: [],
      appliedCode: null,

      addCode: (code) => {
        const { codes } = get();
        // Don't add duplicates
        if (codes.some(c => c.code === code.code)) return;
        set({ codes: [...codes, code] });
      },

      markAsUsed: (code) => {
        set({
          codes: get().codes.map(c =>
            c.code === code ? { ...c, used: true } : c
          )
        });
      },

      applyCode: (code) => {
        set({ appliedCode: code });
      },

      clearAppliedCode: () => {
        set({ appliedCode: null });
      },

      hasCode: (code) => {
        return get().codes.some(c => c.code === code);
      },
    }),
    {
      name: 'yourprettysets-discount-codes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
