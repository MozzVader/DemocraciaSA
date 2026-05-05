'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { formatNumber, formatPerSecond } from '@/lib/game/formatters';

export function InfluenceClicker() {
  const click = useGameStore((s) => s.click);
  const influencia = useGameStore((s) => s.influencia);
  const clickPowerVal = useGameStore((s) => s.clickPower());
  const productionPerSecond = useGameStore((s) => s.productionPerSecond());
  const totalClicks = useGameStore((s) => s.totalClicks);
  const [floats, setFloats] = useState<Array<{ id: number; value: number; x: number }>>([]);

  // Remove old floats after animation
  useEffect(() => {
    if (floats.length > 0) {
      const timer = setTimeout(() => {
        setFloats(prev => prev.slice(1));
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [floats]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    click();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setFloats(prev => [...prev, { id: Date.now() + Math.random(), value: clickPowerVal, x }]);
  }, [click, clickPowerVal]);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-center">
        <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-1 font-mono">
          Influencia Total
        </div>
        <motion.div
          key={Math.floor(influencia)}
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold tabular-nums"
          style={{
            color: '#d4af37',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
          }}
        >
          {formatNumber(influencia)}
        </motion.div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          {formatPerSecond(productionPerSecond)}/s &middot; {formatPerSecond(clickPowerVal)}/click
        </div>
      </div>

      <div className="relative">
        {/* Floating numbers */}
        <AnimatePresence>
          {floats.map(f => (
            <motion.div
              key={f.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -100, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute pointer-events-none font-bold text-lg tabular-nums z-10"
              style={{
                color: '#d4af37',
                left: f.x + '%',
                top: '15%',
                transform: 'translateX(-50%)',
                textShadow: '0 0 10px rgba(212, 175, 55, 0.6)',
              }}
            >
              +{formatNumber(f.value)}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-10"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />

        {/* Click button */}
        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full cursor-pointer
            flex flex-col items-center justify-center gap-2
            transition-all duration-150 select-none"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #2a1f0a 0%, #0f1729 60%, #060a14 100%)',
            border: '3px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.15), inset 0 0 30px rgba(212, 175, 55, 0.05)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sol-de-mayo.png"
            alt="Sol de Mayo"
            className="w-28 h-28 md:w-36 md:h-36 pointer-events-none"
            draggable={false}
          />
          <span className="text-sm font-bold tracking-wider uppercase"
            style={{ color: '#d4af37' }}>
            INFLUENCIAR
          </span>
        </motion.button>
      </div>

      <div className="text-xs text-muted-foreground font-mono">
        {totalClicks.toLocaleString()} clics totales
      </div>
    </div>
  );
}
