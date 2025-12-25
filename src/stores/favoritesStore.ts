import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/products';

interface FavoritesStore {
  items: Product[];
  
  // Actions
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addFavorite: (product) => {
        const { items } = get();
        const exists = items.some(item => item.id === product.id);
        
        if (!exists) {
          set({ items: [...items, product] });
        }
      },

      removeFavorite: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        });
      },

      toggleFavorite: (product) => {
        const { items, addFavorite, removeFavorite } = get();
        const exists = items.some(item => item.id === product.id);
        
        if (exists) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },

      isFavorite: (productId) => {
        return get().items.some(item => item.id === productId);
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
