'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { useAuthStore } from '@/store/auth-store';

const TICK_INTERVAL = 100;
const SAVE_INTERVAL = 30000;

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick);
  const save = useGameStore((s) => s.save);
  const init = useGameStore((s) => s.init);
  const authInit = useAuthStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const initialized = useRef(false);

  // Initialize auth first, then game
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      authInit().then(() => {
        // After auth is resolved, init game with auth status
        const isAuthenticated = useAuthStore.getState().user !== null;
        init(isAuthenticated);
      });
    }
  }, [authInit, init]);

  useEffect(() => {
    const interval = setInterval(() => {
      tick(TICK_INTERVAL);
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const interval = setInterval(() => {
      save();
    }, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [save]);

  useEffect(() => {
    const handleBeforeUnload = () => save();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [save]);

  // When auth state changes, trigger a save to sync cloud
  // BUT only after the game has finished loading to avoid race condition
  const gameLoading = useGameStore((s) => s.loading);
  useEffect(() => {
    if (!authLoading && user && !gameLoading) {
      save();
    }
  }, [user, authLoading, save, gameLoading]);
}
