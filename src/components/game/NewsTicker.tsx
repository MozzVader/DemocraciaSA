'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { getRandomHeadline } from '@/lib/game/news';

export function NewsTicker() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const [headline, setHeadline] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setHeadline(getRandomHeadline(currentPhase));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadline(getRandomHeadline(currentPhase, headline));
    }, 12000);
    return () => clearInterval(interval);
  }, [currentPhase, headline]);

  return (
    <div className="border-t border-[#d4af37]/20"
      style={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#ef4444' }}></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: '#ef4444' }}></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-mono">
            Rotativo
          </span>
        </div>
        <div className="flex-1 overflow-hidden h-5 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={headline}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-muted-foreground italic whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {headline}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
