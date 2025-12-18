import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  customerLogin, 
  customerCreate, 
  customerRecover,
  fetchCustomer,
  type ShopifyCustomer 
} from '@/lib/shopify-auth';

interface AuthStore {
  customer: ShopifyCustomer | null;
  accessToken: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshCustomer: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      accessToken: null,
      expiresAt: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await customerLogin(email, password);
          
          if (result.customerAccessToken) {
            set({ 
              accessToken: result.customerAccessToken.accessToken,
              expiresAt: result.customerAccessToken.expiresAt,
            });
            
            // Fetch customer details
            const customer = await fetchCustomer(result.customerAccessToken.accessToken);
            set({ customer, isLoading: false });
            return { success: true };
          }
          
          if (result.customerUserErrors?.length > 0) {
            const errorMessage = result.customerUserErrors[0].message;
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
          }
          
          set({ isLoading: false, error: 'Login failed' });
          return { success: false, error: 'Login failed' };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      signup: async (email, password, firstName, lastName) => {
        set({ isLoading: true, error: null });
        try {
          const result = await customerCreate(email, password, firstName, lastName);
          
          if (result.customer) {
            // Auto-login after successful signup
            const loginResult = await get().login(email, password);
            return loginResult;
          }
          
          if (result.customerUserErrors?.length > 0) {
            const errorMessage = result.customerUserErrors[0].message;
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
          }
          
          set({ isLoading: false, error: 'Signup failed' });
          return { success: false, error: 'Signup failed' };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({ 
          customer: null, 
          accessToken: null, 
          expiresAt: null,
          error: null 
        });
      },

      recoverPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const result = await customerRecover(email);
          
          if (result.customerUserErrors?.length > 0) {
            const errorMessage = result.customerUserErrors[0].message;
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
          }
          
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password recovery failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      refreshCustomer: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        
        try {
          const customer = await fetchCustomer(accessToken);
          set({ customer });
        } catch (error) {
          // Token might be expired, logout
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'yourprettysets-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        customer: state.customer,
      }),
    }
  )
);