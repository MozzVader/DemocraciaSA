'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';

const TICK_INTERVAL = 100;
const SAVE_INTERVAL = 30000;

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick);
  const save = useGameStore((s) => s.save);
  const init = useGameStore((s) => s.init);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      init();
    }
  }, [init]);

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
}
