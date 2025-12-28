import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/products';

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
  sizeProfileId?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isDrawerOpen: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
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
          // Find items that don't have a sizeProfileId (need sizing help)
          const itemsNeedingSizing = remainingItems.filter(item => !item.sizeProfileId);
          
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
        isLoading: state.isLoading,
      }),
    }
  )
);
