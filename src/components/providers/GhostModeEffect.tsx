'use client';

import { useEffect } from 'react';
import { useGhostMode } from '@/hooks/useGhostMode';

export function GhostModeEffect() {
  const { isGhostMode, mounted } = useGhostMode();

  useEffect(() => {
    // Only run after mount to avoid hydration mismatch
    if (!mounted) return;
    
    if (isGhostMode) {
      document.body.classList.add('ghost-mode-active');
    } else {
      document.body.classList.remove('ghost-mode-active');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('ghost-mode-active');
    };
  }, [isGhostMode, mounted]);

  return null;
}
