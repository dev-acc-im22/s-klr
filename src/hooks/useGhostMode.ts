'use client';

import { useGhostStore, mockGhostUser } from '@/store/useGhostStore';
import { useHydrated } from '@/components/providers/HydrationProvider';

/**
 * Custom hook for Ghost Mode functionality
 * Uses HydrationProvider context for consistent hydration state
 */
export function useGhostMode() {
  // Use unified hydration state from context
  const mounted = useHydrated();
  
  const isGhostMode = useGhostStore((state) => state.isGhostMode);
  const toggleGhostMode = useGhostStore((state) => state.toggleGhostMode);
  const setGhostMode = useGhostStore((state) => state.setGhostMode);
  
  return {
    /** Whether ghost mode is currently active */
    isGhostMode: mounted ? isGhostMode : false,
    
    /** Toggle ghost mode on/off */
    toggleGhostMode,
    
    /** Set ghost mode to a specific value */
    setGhostMode,
    
    /** Whether the ghost mode toggle should be visible */
    showToggle: mounted,
    
    /** Mock user data to use when ghost mode is active */
    ghostUser: mounted && isGhostMode ? mockGhostUser : null,
    
    /** Check if current user is authenticated (ghost or real) */
    isAuthenticated: mounted ? isGhostMode : false,
    
    /** Helper for conditional rendering */
    canAccess: (hasRealAuth: boolean) => isGhostMode || hasRealAuth,
    
    /** Whether the component is mounted (for hydration safety) */
    mounted,
  };
}

export default useGhostMode;
