'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/game-store';

const TICK_INTERVAL = 100; // 10 ticks per second
const SAVE_INTERVAL = 30000; // Auto-save every 30 seconds

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick);
  const save = useGameStore((s) => s.save);
  const init = useGameStore((s) => s.init);
  const initialized = useRef(false);

  // Initialize game on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      init();
    }
  }, [init]);

  // Game tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      tick(TICK_INTERVAL);
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tick]);

  // Auto-save loop
  useEffect(() => {
    const interval = setInterval(() => {
      save();
    }, SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [save]);

  // Save on tab close
  const handleBeforeUnload = useCallback(() => {
    save();
  }, [save]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);
}
