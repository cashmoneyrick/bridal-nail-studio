import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';

interface FavoritesStore {
  items: ShopifyProduct[];
  
  // Actions
  addFavorite: (product: ShopifyProduct) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: ShopifyProduct) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addFavorite: (product) => {
        const { items } = get();
        const exists = items.some(item => item.node.id === product.node.id);
        
        if (!exists) {
          set({ items: [...items, product] });
        }
      },

      removeFavorite: (productId) => {
        set({
          items: get().items.filter(item => item.node.id !== productId)
        });
      },

      toggleFavorite: (product) => {
        const { items, addFavorite, removeFavorite } = get();
        const exists = items.some(item => item.node.id === product.node.id);
        
        if (exists) {
          removeFavorite(product.node.id);
        } else {
          addFavorite(product);
        }
      },

      isFavorite: (productId) => {
        return get().items.some(item => item.node.id === productId);
      },

      clearFavorites: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'yourprettysets-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);