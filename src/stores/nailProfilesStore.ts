import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface NailSizes {
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

export interface NailProfile {
  id: string;
  name: string;
  sizes: NailSizes;
  createdAt: string;
  updatedAt: string;
}

interface NailProfilesStore {
  profiles: NailProfile[];
  selectedProfileId: string | null;
  
  // Actions
  addProfile: (name: string, sizes: NailSizes) => string;
  updateProfile: (id: string, name: string, sizes: NailSizes) => void;
  deleteProfile: (id: string) => void;
  selectProfile: (id: string | null) => void;
  getProfile: (id: string) => NailProfile | undefined;
  getSelectedProfile: () => NailProfile | undefined;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useNailProfilesStore = create<NailProfilesStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      selectedProfileId: null,

      addProfile: (name, sizes) => {
        const id = generateId();
        const newProfile: NailProfile = {
          id,
          name,
          sizes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          profiles: [...state.profiles, newProfile],
          selectedProfileId: id, // Auto-select new profile
        }));
        
        return id;
      },

      updateProfile: (id, name, sizes) => {
        set(state => ({
          profiles: state.profiles.map(profile =>
            profile.id === id
              ? { ...profile, name, sizes, updatedAt: new Date().toISOString() }
              : profile
          ),
        }));
      },

      deleteProfile: (id) => {
        set(state => ({
          profiles: state.profiles.filter(profile => profile.id !== id),
          selectedProfileId: state.selectedProfileId === id ? null : state.selectedProfileId,
        }));
      },

      selectProfile: (id) => {
        set({ selectedProfileId: id });
      },

      getProfile: (id) => {
        return get().profiles.find(profile => profile.id === id);
      },

      getSelectedProfile: () => {
        const { profiles, selectedProfileId } = get();
        return profiles.find(profile => profile.id === selectedProfileId);
      },
    }),
    {
      name: 'yourprettysets-nail-profiles',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
