import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/products';

export interface NailSizesSnapshot {
  leftPinky: string;
  leftRing: string;
  leftMiddle: string;
  leftIndex: string;
  leftThumb: string;
  rightThumb: string;
  rightIndex: string;
  rightMiddle: string;
  rightRing: string;
  rightPinky: string;
}

export interface CartItem {
  product: Product;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  needsSizingKit: boolean;
  sizingOption: 'kit' | 'known';
  sizeProfileId?: string;
  sizeProfileSnapshot?: {
    name: string;
    sizes: NailSizesSnapshot;
  };
}

interface CartStore {
  items: CartItem[];
  savedItems: CartItem[];
  isLoading: boolean;
  isDrawerOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  updateItem: (oldVariantId: string, updates: {
    variantId: string;
    variantTitle: string;
    selectedOptions: CartItem['selectedOptions'];
  }) => void;
  saveForLater: (variantId: string) => void;
  moveToCart: (variantId: string) => void;
  removeSavedItem: (variantId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hasSizingKitInCart: () => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      isLoading: false,
      isDrawerOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        const { items } = get();
        const itemToRemove = items.find(item => item.variantId === variantId);
        const hadSizingKit = itemToRemove?.needsSizingKit === true;
        
        // Remove the item
        set({
          items: items.filter(item => item.variantId !== variantId)
        });
        
        // If removed item had sizing kit, reassign to another qualifying item
        if (hadSizingKit && get().items.length > 0) {
          const remainingItems = get().items;
        // Find items that chose 'kit' option (need sizing help)
        const itemsNeedingSizing = remainingItems.filter(item => item.sizingOption === 'kit');
          
          // If any items need sizing and none currently have the kit, assign to first one
          if (itemsNeedingSizing.length > 0 && !remainingItems.some(item => item.needsSizingKit)) {
            set({
              items: remainingItems.map(item => 
                item.variantId === itemsNeedingSizing[0].variantId
                  ? { ...item, needsSizingKit: true }
                  : item
              )
            });
          }
        }
      },

      updateItem: (oldVariantId, updates) => {
        const { items } = get();
        const itemToUpdate = items.find(i => i.variantId === oldVariantId);
        if (!itemToUpdate) return;

        // Check if another item already has the new variantId
        const existingTarget = items.find(
          i => i.variantId === updates.variantId && i.variantId !== oldVariantId
        );

        if (existingTarget) {
          // Merge: add quantity to existing, remove old
          set({
            items: items
              .map(i =>
                i.variantId === updates.variantId
                  ? { ...i, quantity: i.quantity + itemToUpdate.quantity }
                  : i
              )
              .filter(i => i.variantId !== oldVariantId)
          });
        } else {
          // Update in-place
          set({
            items: items.map(i =>
              i.variantId === oldVariantId
                ? { ...i, ...updates }
                : i
            )
          });
        }
      },

      saveForLater: (variantId) => {
        const { items } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item) return;

        const hadSizingKit = item.needsSizingKit;

        // Move to saved with quantity 1
        set({
          savedItems: [...get().savedItems, { ...item, quantity: 1 }],
          items: items.filter(i => i.variantId !== variantId)
        });

        // Reassign sizing kit if needed
        if (hadSizingKit && get().items.length > 0) {
          const remainingItems = get().items;
          const itemsNeedingSizing = remainingItems.filter(i => i.sizingOption === 'kit');
          if (itemsNeedingSizing.length > 0 && !remainingItems.some(i => i.needsSizingKit)) {
            set({
              items: remainingItems.map(i =>
                i.variantId === itemsNeedingSizing[0].variantId
                  ? { ...i, needsSizingKit: true }
                  : i
              )
            });
          }
        }
      },

      moveToCart: (variantId) => {
        const { savedItems, items } = get();
        const item = savedItems.find(i => i.variantId === variantId);
        if (!item) return;

        // Check if same variant already in cart
        const existing = items.find(i => i.variantId === variantId);
        if (existing) {
          set({
            items: items.map(i =>
              i.variantId === variantId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            savedItems: savedItems.filter(i => i.variantId !== variantId)
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            savedItems: savedItems.filter(i => i.variantId !== variantId)
          });
        }
      },

      removeSavedItem: (variantId) => {
        set({
          savedItems: get().savedItems.filter(i => i.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setLoading: (isLoading) => set({ isLoading }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
      },

      hasSizingKitInCart: () => {
        return get().items.some(item => item.needsSizingKit === true);
      },

      openDrawer: () => {
        set({ isDrawerOpen: true });
      },

      closeDrawer: () => {
        set({ isDrawerOpen: false });
      },
    }),
    {
      name: 'yourprettysets-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        savedItems: state.savedItems,
        isLoading: state.isLoading,
      }),
    }
  )
);
