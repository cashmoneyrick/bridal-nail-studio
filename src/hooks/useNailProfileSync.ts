import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNailProfilesStore } from '@/stores/nailProfilesStore';

/**
 * Hook that automatically syncs nail profiles with the database when user authentication changes.
 * - When user logs in: migrates any localStorage profiles to DB, then syncs from DB
 * - When user logs out: clears sync state so localStorage is used again
 */
export const useNailProfileSync = () => {
  const user = useAuthStore(state => state.user);
  const { 
    syncFromDatabase, 
    migrateLocalToDatabase, 
    setUserId, 
    clearSyncState,
    isLoading,
    isSynced,
    userId 
  } = useNailProfilesStore();

  useEffect(() => {
    const syncProfiles = async () => {
      if (user?.id) {
        // User just logged in
        if (userId !== user.id) {
          setUserId(user.id);
          // First migrate any local profiles to the database
          await migrateLocalToDatabase(user.id);
          // Then sync from database to get the authoritative data
          await syncFromDatabase(user.id);
        }
      } else if (userId) {
        // User logged out
        clearSyncState();
      }
    };

    syncProfiles();
  }, [user?.id, userId, setUserId, migrateLocalToDatabase, syncFromDatabase, clearSyncState]);

  return { isLoading, isSynced, isAuthenticated: !!user };
};
