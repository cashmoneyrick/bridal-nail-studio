import { create } from 'zustand';

interface MenuStore {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  isChatOpen: false,
  setChatOpen: (open) => set({ isChatOpen: open }),
}));
