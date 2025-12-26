import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/lib/logger';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthStore {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recoverPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  error: null,
  initialized: false,

  initialize: async () => {
    // Set up auth state listener FIRST
    supabase.auth.onAuthStateChange(
      (event, session) => {
        set({ session, user: session?.user ?? null });
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            get().fetchProfile();
          }, 0);
        } else {
          set({ profile: null });
        }
      }
    );

    // THEN check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    set({ 
      session, 
      user: session?.user ?? null,
      initialized: true 
    });

    if (session?.user) {
      await get().fetchProfile();
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  signup: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName?.trim() || null,
            last_name: lastName?.trim() || null,
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        set({ isLoading: false });
        return { success: true, error: 'Please check your email to confirm your account' };
      }

      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ 
      user: null, 
      session: null,
      profile: null,
      isLoading: false,
      error: null 
    });
  },

  recoverPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/auth` }
      );

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password recovery failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        logError('Error fetching profile:', error);
        return;
      }

      set({ profile: data as UserProfile | null });
    } catch (error) {
      logError('Error fetching profile:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
