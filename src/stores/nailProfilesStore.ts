import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

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
  isLoading: boolean;
  isSynced: boolean;
  userId: string | null;
  
  // Actions
  addProfile: (name: string, sizes: NailSizes) => Promise<string>;
  updateProfile: (id: string, name: string, sizes: NailSizes) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  selectProfile: (id: string | null) => Promise<void>;
  getProfile: (id: string) => NailProfile | undefined;
  getSelectedProfile: () => NailProfile | undefined;
  
  // Sync actions
  syncFromDatabase: (userId: string) => Promise<void>;
  migrateLocalToDatabase: (userId: string) => Promise<void>;
  setUserId: (userId: string | null) => void;
  clearSyncState: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useNailProfilesStore = create<NailProfilesStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      selectedProfileId: null,
      isLoading: false,
      isSynced: false,
      userId: null,

      setUserId: (userId) => {
        set({ userId, isSynced: false });
      },

      clearSyncState: () => {
        set({ isSynced: false, userId: null });
      },

      syncFromDatabase: async (userId) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('nail_profiles')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

          if (error) throw error;

          const profiles: NailProfile[] = (data || []).map((row: any) => ({
            id: row.id,
            name: row.name,
            sizes: row.sizes as unknown as NailSizes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));

          // Find the selected profile
          const selectedRow = (data as any[])?.find((row) => row.is_selected);
          
          set({ 
            profiles, 
            selectedProfileId: selectedRow?.id || (profiles.length > 0 ? profiles[0].id : null),
            isSynced: true,
            userId,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to sync profiles from database:', error);
          set({ isLoading: false });
        }
      },

      migrateLocalToDatabase: async (userId) => {
        const { profiles } = get();
        if (profiles.length === 0) return;

        set({ isLoading: true });
        try {
          // Check if user already has profiles in database
          const { data: existingProfiles } = await supabase
            .from('nail_profiles')
            .select('id')
            .eq('user_id', userId)
            .limit(1);

          // If user already has profiles in DB, don't migrate
          if (existingProfiles && existingProfiles.length > 0) {
            set({ isLoading: false });
            return;
          }

          // Migrate local profiles to database
          const { selectedProfileId } = get();
          for (const profile of profiles) {
            await (supabase.from('nail_profiles') as any).insert({
              user_id: userId,
              name: profile.name,
              sizes: profile.sizes as unknown,
              is_selected: profile.id === selectedProfileId,
            });
          }

          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to migrate profiles to database:', error);
          set({ isLoading: false });
        }
      },

      addProfile: async (name, sizes) => {
        const { userId } = get();
        const id = generateId();
        const now = new Date().toISOString();
        
        const newProfile: NailProfile = {
          id,
          name,
          sizes,
          createdAt: now,
          updatedAt: now,
        };

        if (userId) {
          // Sync to database
          try {
            const { data, error } = await (supabase
              .from('nail_profiles') as any)
              .insert({
                user_id: userId,
                name,
                sizes: sizes as unknown,
                is_selected: true,
              })
              .select()
              .single();

            if (error) throw error;

            // Deselect other profiles
            await (supabase
              .from('nail_profiles') as any)
              .update({ is_selected: false })
              .eq('user_id', userId)
              .neq('id', data.id);

            const dbProfile: NailProfile = {
              id: data.id,
              name: data.name,
              sizes: data.sizes as unknown as NailSizes,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };

            set(state => ({
              profiles: [...state.profiles, dbProfile],
              selectedProfileId: data.id,
            }));

            return data.id;
          } catch (error) {
            console.error('Failed to add profile to database:', error);
            throw error;
          }
        } else {
          // Local only
          set(state => ({
            profiles: [...state.profiles, newProfile],
            selectedProfileId: id,
          }));
          return id;
        }
      },

      updateProfile: async (id, name, sizes) => {
        const { userId } = get();

        if (userId) {
          try {
            const { error } = await (supabase
              .from('nail_profiles') as any)
              .update({ name, sizes: sizes as unknown, updated_at: new Date().toISOString() })
              .eq('id', id)
              .eq('user_id', userId);

            if (error) throw error;

            set(state => ({
              profiles: state.profiles.map(profile =>
                profile.id === id
                  ? { ...profile, name, sizes, updatedAt: new Date().toISOString() }
                  : profile
              ),
            }));
          } catch (error) {
            console.error('Failed to update profile in database:', error);
            throw error;
          }
        } else {
          set(state => ({
            profiles: state.profiles.map(profile =>
              profile.id === id
                ? { ...profile, name, sizes, updatedAt: new Date().toISOString() }
                : profile
            ),
          }));
        }
      },

      deleteProfile: async (id) => {
        const { userId, selectedProfileId, profiles } = get();

        if (userId) {
          try {
            const { error } = await (supabase
              .from('nail_profiles') as any)
              .delete()
              .eq('id', id)
              .eq('user_id', userId);

            if (error) throw error;

            const remainingProfiles = profiles.filter(p => p.id !== id);
            const newSelectedId = selectedProfileId === id 
              ? (remainingProfiles.length > 0 ? remainingProfiles[0].id : null)
              : selectedProfileId;

            set({
              profiles: remainingProfiles,
              selectedProfileId: newSelectedId,
            });
          } catch (error) {
            console.error('Failed to delete profile from database:', error);
            throw error;
          }
        } else {
          set(state => ({
            profiles: state.profiles.filter(profile => profile.id !== id),
            selectedProfileId: state.selectedProfileId === id ? null : state.selectedProfileId,
          }));
        }
      },

      selectProfile: async (id) => {
        const { userId, profiles } = get();

        if (userId && id) {
          try {
            // Deselect all
            await (supabase
              .from('nail_profiles') as any)
              .update({ is_selected: false })
              .eq('user_id', userId);

            // Select the new one
            await (supabase
              .from('nail_profiles') as any)
              .update({ is_selected: true })
              .eq('id', id)
              .eq('user_id', userId);
          } catch (error) {
            console.error('Failed to update selection in database:', error);
          }
        }

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
      partialize: (state) => ({
        profiles: state.profiles,
        selectedProfileId: state.selectedProfileId,
      }),
    }
  )
);
